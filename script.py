import asyncio
import websockets
import json
import mss
import io
import threading
import time
import os
from flask import Flask, Response
from flask_cors import CORS
from PIL import Image, ImageDraw
from pynput.mouse import Controller, Button
from pynput.keyboard import Controller as KbdController, Key

# --- CẤU HÌNH ---
app = Flask(__name__)
CORS(app)
mouse = Controller()
keyboard = KbdController()

is_alt_held = False

# Nâng cấp bảng phím: Thêm các nút Media cho Màn hình Giải trí
SPECIAL_KEYS = {
    'Enter': Key.enter, 'Backspace': Key.backspace, 'Escape': Key.esc,
    'Tab': Key.tab, 'Control': Key.ctrl, 'Alt': Key.alt, 'Shift': Key.shift,
    'Meta': Key.cmd, 'Space': Key.space, 'Delete': Key.delete,
    'Up': Key.up, 'Down': Key.down, 'Left': Key.left, 'Right': Key.right,
    'PrtSc': Key.print_screen,
    'playpause': Key.media_play_pause,
    'nexttrack': Key.media_next,
    'prevtrack': Key.media_previous,
    'volumeup': Key.media_volume_up,
    'volumedown': Key.media_volume_down,
    'volumemute': Key.media_volume_mute
}


# 1. LUỒNG VIDEO (MJPEG)
def generate_frames():
    with mss.mss() as sct:
        monitor = sct.monitors[1]
        while True:
            try:
                sct_img = sct.grab(monitor)
                img = Image.frombytes("RGB", sct_img.size, sct_img.bgra, "raw", "BGRX")
                mx, my = mouse.position
                rx, ry = (mx - monitor["left"]), (my - monitor["top"])

                draw = ImageDraw.Draw(img)
                draw.ellipse([rx - 10, ry - 10, rx + 10, ry + 10], fill="white", outline="black", width=2)
                draw.ellipse([rx - 3, ry - 3, rx + 3, ry + 3], fill="red")

                # --- 🛠️ 2 DÒNG QUAN TRỌNG ĐÃ ĐƯỢC CHỈNH SỬA ---
                # Tăng độ phân giải lên HD (1280x720) thay vì 800x450
                img.thumbnail((1280, 720))

                buf = io.BytesIO()
                # Tăng chất lượng ảnh từ 35 lên 75 (hoặc 80)
                img.save(buf, format='JPEG', quality=75)
                # ----------------------------------------------

                yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + buf.getvalue() + b'\r\n')
            except:
                break


@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


# 2. LUỒNG LỆNH (WEBSOCKET)
async def handle_commands(websocket):
    global is_alt_held
    print("🟢 Điện thoại đã kết nối lệnh!")
    try:
        async for message in websocket:
            data = json.loads(message)
            action = data.get('action')

            # --- LUỒNG CHUỘT ---
            if action == 'move':
                mouse.move(int(data.get('dx', 0)), int(data.get('dy', 0)))
            elif action == 'drag_start':
                mouse.press(Button.left)
            elif action == 'drag_end':
                mouse.release(Button.left)
            elif action == 'scroll':
                mouse.scroll(0, data.get('dy', 0))
            elif action == 'click':
                if is_alt_held:
                    keyboard.release(Key.alt)
                    is_alt_held = False
                btn = Button.left if data.get('button') == 'left' else Button.right
                mouse.click(btn)

            # --- LUỒNG BÀN PHÍM CƠ BẢN (GÕ & NHẢ) ---
            elif action == 'keypress':
                k = data.get('key')
                target = SPECIAL_KEYS.get(k, k)
                try:
                    keyboard.press(target)
                    keyboard.release(target)
                except:
                    pass

            # --- LUỒNG GAMEPAD (GIỮ & NHẢ ĐỘC LẬP) ---
            elif action == 'keydown':
                k = data.get('key')
                target = SPECIAL_KEYS.get(k, k)
                try:
                    keyboard.press(target)
                except:
                    pass

            elif action == 'keyup':
                k = data.get('key')
                target = SPECIAL_KEYS.get(k, k)
                try:
                    keyboard.release(target)
                except:
                    pass

            # --- TỔ HỢP PHÍM ---
            elif action == 'alt_tab_step':
                if not is_alt_held:
                    keyboard.press(Key.alt)
                    is_alt_held = True
                    time.sleep(0.1)
                keyboard.press(Key.tab)
                keyboard.release(Key.tab)
            elif action == 'release_alt':
                if is_alt_held:
                    keyboard.release(Key.alt)
                    is_alt_held = False
            elif action == 'shortcut':
                mod = SPECIAL_KEYS.get(data.get('mod'))
                target = SPECIAL_KEYS.get(data.get('key'), data.get('key'))
                if mod:
                    with keyboard.pressed(mod):
                        keyboard.press(target)
                        keyboard.release(target)

            # --- LUỒNG ĐIỀU KHIỂN NGUỒN WINDOWS ---
            elif action == 'power':
                cmd = data.get('command')
                if cmd == 'shutdown':
                    os.system("shutdown /s /t 0")
                elif cmd == 'restart':
                    os.system("shutdown /r /t 0")
                elif cmd == 'sleep':
                    # Lệnh ngủ đông/Sleep của Windows
                    os.system("rundll32.exe powrprof.dll,SetSuspendState 0,1,0")

    except:
        # Xử lý nhả chuột và phím nếu kết nối bị đứt đột ngột
        mouse.release(Button.left)
        if is_alt_held:
            keyboard.release(Key.alt)
            is_alt_held = False


def start_ws_thread():
    async def ws_main():
        async with websockets.serve(handle_commands, "0.0.0.0", 8765):
            await asyncio.Future()

    asyncio.run(ws_main())


if __name__ == '__main__':
    threading.Thread(target=start_ws_thread, daemon=True).start()
    print("🚀 Server v2.5 đang chạy...")
    print("Sẵn sàng nhận lệnh từ Mobile App!")
    app.run(host='0.0.0.0', port=5000, threaded=True, debug=False, use_reloader=False)