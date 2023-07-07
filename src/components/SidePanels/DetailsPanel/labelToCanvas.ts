type Cooordinate = Array<number>;
const DPR = window.devicePixelRatio;

// 获取x、y轴归一因子
function getNormalizeFactor(originW: number, originH: number) {
    return {
        xFactor: originW / 100,
        yFactor: originH / 100,
    }
}

// 根据路径获取包围盒的坐标
function getBoundRect(points: Array<Cooordinate>) {
    let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
    points.forEach((coord: Cooordinate) => {
        const x = coord[0], y = coord[1];
        left = Math.min(x, left);
        top = Math.min(y, top);
        right = Math.max(x, right);
        bottom = Math.max(y, bottom);
    })
    return {
        left,
        top,
        right,
        bottom,
        width: right - left,
        height: bottom - top
    }
}

// 获取canvas中Plogon的包围盒坐标
function getPolygonbbox(originW: number, originH: number, points: Array<Cooordinate>) {
    const { xFactor, yFactor } = getNormalizeFactor(originW, originH);
    const { left, top, right, bottom, width, height } = getBoundRect(points);
    return {
        left: left * xFactor,
        right: right * xFactor,
        top: top * yFactor,
        bottom: bottom * yFactor,
        width: width * xFactor,
        height: height * yFactor
    }
}

// 获取canvas中矩形的包围盒坐标
function getRectbbox(originW: number, originH: number, bbox: any) {
    const { xFactor, yFactor } = getNormalizeFactor(originW, originH);
    return {
        left: bbox.left * xFactor,
        righ: bbox.right * xFactor,
        top: bbox.top * yFactor,
        bottom: bbox.bottom * yFactor,
        width: (bbox.right - bbox.left) * xFactor,
        height: (bbox.bottom - bbox.top) * yFactor,
    }
}

// 创建HTMLImageElement
function createImg(imgURL: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imgURL
        img.addEventListener('load', () => {
            resolve(img);
        });
    })
}

/**
 * 使用drawImage导入到新的canvas，然后输出dataURL
 * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images
 * @param {*} data 使用drawImage支持的输入对象
 * @param {*} sx 数据源的起点x
 * @param {*} sy 数据源的起点y
 * @param {*} sw 数据源的width
 * @param {*} sh 数据源的height
 */
function createCavans(data: HTMLElement, sx: number, sy: number, sw: number, sh: number, dx: number = 0, dy: number = 0, dw: number, dh: number) {
    // ctx.drawImage(data, sx, sy, sw, sh, 0, 0, sw, sh);
    // 创建canvas
    const canvas = document.createElement('canvas');
    canvas.width = dw;
    canvas.height = dh;
    canvas.style.width = dw / DPR + 'px';
    canvas.style.height = dh / DPR + 'px';
    // 导出
    const exportCtx: any = canvas.getContext('2d');
    exportCtx.drawImage(data, sx, sy, sw, sh, dx, dy, dw, dh);

    return {
        canvas,
        canvasCtx: exportCtx,
    };
}

// 使用ImageElement生成Canvas，
function getCavnas(imgEL: any, width: number, height: number, bbox: any) {
    const { left: x, top: y, width: w, height: h } = getRectbbox(width, height, bbox);
    return createCavans(
        imgEL,
        x, y, w, h,
        0, 0, w, h,
    );
}

// http请求for图片灰度
async function requestTransform(url: string, data: JSON): Promise<any> {
    const response: any = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    const responseData = response.json();
    return new Promise((resolve, reject) => {
        if (responseData) {
            resolve(responseData);
        } else {
            reject('error');
        }
    })
}

export {
    createImg,
    createCavans,
    getCavnas,
    requestTransform,
}