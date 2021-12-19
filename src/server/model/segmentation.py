import cv2 as opencv
import numpy as np
import os

class OpenCVSegmenter:

    def grabcut(self,
        image,
        roi,
        iterations = 4
    ):
        """
        """

        # Parse input format:
        assert isinstance(image, np.array)
        if image.ndim == 3 & image.shape[2] == 3:
            image = opencv.cvtColor(image, opencv.COLOR_BGR2GRAY)

        # initiate the label mask:
        mask = np.zeros(image.shape[:2], dtype=np.uint8)
        
        # Run grabcut:
        opencv.grabCut(image, mask, roi, 
            iterCount=iterations, 
            mode=opencv.GC_INIT_WITH_RECT
        )

        return mask

    def face_detect(self):
        pass
   