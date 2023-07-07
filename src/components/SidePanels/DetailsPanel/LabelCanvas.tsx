import { observer } from 'mobx-react';
import { FC, useRef } from 'react';
import { createImg, getCavnas, requestTransform } from './labelToCanvas';
interface LabelCavnasProps {
    imgData: any, // image URL or dataURL or HTMLImageElement
    labelData: any,
}

export const LabelCanvas: FC<LabelCavnasProps> = observer(({
    imgData,
    labelData,
}) => {
    const { original_width, original_height, bboxCoords } = labelData;
    const imgType = typeof imgData;
    const grayWrapRef = useRef(null);

    if (imgType === 'object') {
        const cavanEl = getCavnas(imgData, original_width, original_height, bboxCoords).canvas;
        if (cavanEl) {
            const url = window.origin + '/api/transform/gray'
            const postData: any = {
                'dataURL': cavanEl.toDataURL(),
            }
            // 发起处理图片的请求
            requestTransform(url, postData).then((res: any) => {
                createImg(res.data).then((imgEl: HTMLImageElement) => {
                    if (grayWrapRef.current && imgEl) {
                        imgEl.style.maxWidth = 200 + 'px';
                        grayWrapRef.current.appendChild(imgEl);
                    }
                })
            })
        }
    }
    return <div id="gray-img" ref={grayWrapRef}></div>;
});
