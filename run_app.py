import subprocess
import time
import sys
import os

def main():
    print("==================================================")
    print(" Launching NyayaLens AI Platform Servers ")
    print(" Tagline: Understand the fine print. Navigate your next step.")
    print("==================================================")

    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")
    frontend_dir = os.path.join(root_dir, "frontend")

    venv_python = os.path.join(backend_dir, "venv", "Scripts", "python.exe")
    if not os.path.exists(venv_python):
        venv_python = sys.executable

    print("\n[1/2] Starting FastAPI Multi-Agent Backend on http://127.0.0.1:8000 ...")
    backend_process = subprocess.Popen(
        [venv_python, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"],
        cwd=backend_dir,
        env=dict(os.environ, PYTHONPATH=backend_dir)
    )

    time.sleep(2)

    print("[2/2] Starting React Vite Frontend Dashboard on http://localhost:3000 ...")
    frontend_process = subprocess.Popen(
        ["npx", "vite", "--port", "3000"],
        cwd=frontend_dir,
        shell=True
    )

    print("\n--------------------------------------------------")
    print(" NyayaLens AI is live!")
    print(" • Frontend UI:  http://localhost:3000")
    print(" • Backend API: http://127.0.0.1:8000/docs")
    print(" Press Ctrl+C to stop both servers.")
    print("--------------------------------------------------\n")

    try:
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\nShutting down NyayaLens AI servers...")
        backend_process.terminate()
        frontend_process.terminate()

if __name__ == "__main__":
    main()
