#!/usr/bin/env python3
"""
Simple HTTP Server untuk Website Dodod Saketi
Jalankan dengan: python server.py
Kemudian buka: http://localhost:8080
"""

import http.server
import socketserver
import os
import webbrowser
import socket
import threading
import time
from pathlib import Path

# Set port
PORT = 5500

# Change to the directory where HTML files are located
os.chdir(Path(__file__).parent)

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Override to prevent flooding console with logs
        if not any(ext in self.path for ext in ['.css', '.js', '.png', '.jpg', '.ico']):
            print(f"📄 {self.client_address[0]} - {format % args}")
    
    def end_headers(self):
        # Add headers to prevent caching during development
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        # Add CORS headers for better compatibility
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_GET(self):
        try:
            # If requesting root, serve index.html
            if self.path == '/':
                self.path = '/index.html'
            return super().do_GET()
        except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError) as e:
            print(f"⚠️  Koneksi terputus: {e}")
            return
        except Exception as e:
            print(f"❌ Error handling request: {e}")
            return

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True
    
    def server_bind(self):
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        super().server_bind()

def check_port(port):
    """Check if port is available"""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind(('localhost', port))
            return True
    except OSError:
        return False

def find_available_port(start_port=8080):
    """Find an available port starting from start_port"""
    port = start_port
    while port < start_port + 100:
        if check_port(port):
            return port
        port += 1
    return None

def start_server():
    global PORT
    
    print("🌿 Starting Dodod Saketi Website Server...")
    print(f"📂 Serving files from: {os.getcwd()}")
    
    # Check if default port is available
    if not check_port(PORT):
        print(f"⚠️  Port {PORT} sedang digunakan, mencari port lain...")
        new_port = find_available_port(PORT)
        if new_port:
            PORT = new_port
            print(f"✅ Menggunakan port {PORT}")
        else:
            print("❌ Tidak dapat menemukan port yang tersedia!")
            return
    
    print(f"🌐 Server URL: http://localhost:{PORT}")
    print("📱 Website akan terbuka otomatis di browser...")
    print("⚠️  Tekan Ctrl+C untuk menghentikan server")
    print("-" * 50)
    
    try:
        with ThreadedTCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            # Set timeout to handle connection issues
            httpd.timeout = 1.0
            
            # Open browser automatically after a short delay
            def open_browser():
                time.sleep(2)
                webbrowser.open(f'http://localhost:{PORT}')
            
            browser_thread = threading.Thread(target=open_browser, daemon=True)
            browser_thread.start()
            
            print(f"✅ Server berjalan di http://localhost:{PORT}")
            print("🔄 Server siap menerima request...")
            print("💡 Tip: Refresh halaman jika ada masalah loading")
            
            # Handle server loop with better error handling
            while True:
                try:
                    httpd.handle_request()
                except (ConnectionAbortedError, ConnectionResetError) as e:
                    print(f"⚠️  Koneksi client terputus: {type(e).__name__}")
                    continue
                except KeyboardInterrupt:
                    raise
                except Exception as e:
                    print(f"⚠️  Error saat handling request: {e}")
                    continue
            
    except KeyboardInterrupt:
        print("\n🛑 Server dihentikan oleh user")
        print("👋 Terima kasih telah menggunakan Dodod Saketi Server!")
    except OSError as e:
        if e.errno == 10048:  # Windows error for "Address already in use"
            print(f"❌ Port {PORT} sudah digunakan!")
            print("💡 Coba tutup aplikasi lain yang menggunakan port tersebut")
            print("🔄 Atau restart script ini untuk mencari port lain")
        else:
            print(f"❌ Network Error: {e}")
            print("💡 Coba restart script atau check koneksi internet")
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
        print("💡 Silakan restart server")

if __name__ == "__main__":
    start_server()
