"""
Simple HTTP server to serve the UI files
Run this alongside your FastAPI server
"""

import http.server
import socketserver
import webbrowser
import os
from pathlib import Path

PORT = 3000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers to allow communication with FastAPI server
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def main():
    # Change to the directory containing the HTML files
    os.chdir(Path(__file__).parent)
    
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"🌐 UI Server running at http://localhost:{PORT}")
        print(f"📁 Serving files from: {os.getcwd()}")
        print("🔗 Make sure your FastAPI server is running on http://localhost:8000")
        print("🚀 Opening browser...")
        
        # Open browser automatically
        webbrowser.open(f'http://localhost:{PORT}')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Server stopped")

if __name__ == "__main__":
    main()

