@echo off
REM NextDawn · 聪之路 · Satoshi Path —— 本地启动
REM 用本地服务器打开（不要直接双击 index.html）：
REM   1) 浏览器内的交互演示需要 crypto.subtle，file:// 下不可用，http://localhost 才行
REM   2) 课程内容是按需 import 的，也需要服务器
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo   NextDawn - Satoshi Path  ->  http://localhost:8777/
echo   关闭本窗口即停止。若浏览器先打开报错，刷新一下即可。
echo.
start "" http://localhost:8777/
python -m http.server 8777
