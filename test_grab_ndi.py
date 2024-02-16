import time
import base64
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

import NDIlib as ndi
import numpy as np
import cv2

ndi_send = ndi.send_create()
video_frame = ndi.VideoFrameV2()

def send_frame_to_ndi(frame):
    
    video_frame.data = frame
    video_frame.xres = frame.shape[1]
    video_frame.yres = frame.shape[0]
    video_frame.FourCC = ndi.FOURCC_VIDEO_TYPE_BGRA
    video_frame.line_stride_in_bytes = frame.strides[0]
    ndi.send_send_video_v2(ndi_send, video_frame)

def main():
    # Configure Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run Chrome in headless mode (without GUI)
    
    # Set path to your ChromeDriver executable
    chrome_driver_path = 'chromedriver.exe'
    
    # Create a new ChromeDriver service
    service = Service(chrome_driver_path)
    
    # Start the ChromeDriver service
    service.start()
    
    # Create a new ChromeDriver instance
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    # Navigate to the desired URL
    driver.get('http://localhost:3000')  # Replace with your desired URL
    
    # Wait for ten seconds
    time.sleep(2)
    while True:
        try:
            
            # Capture the content of the entire window
            screenshot = driver.get_screenshot_as_base64()
            
            # Convert the base64-encoded PNG to OpenCV frame
            frame_data = base64.b64decode(screenshot)
            frame_array = np.frombuffer(frame_data, np.uint8)
            frame = cv2.imdecode(frame_array, cv2.IMREAD_COLOR)
            
            if frame is not None:
                # Convert frame to BGRA color space
                frame_bgra = cv2.cvtColor(frame, cv2.COLOR_BGR2BGRA)
                #frame_data = np.ascontiguousarray(frame_bgra)
                
                # Send frame to NDI
                send_frame_to_ndi(frame_bgra)
            else:
                print("Failed to decode frame from screenshot.")
        except Exception as e:
            print("An error occurred:", str(e))
            import traceback
            traceback.print_exc()
            break
            
    # Quit the browser and clean up
    driver.quit()
    ndi.send_destroy(ndi_send)

if __name__ == "__main__":
    main()