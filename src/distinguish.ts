import {
  uaArr,
  versionArr,
  uploadUrl,
  getCrc32checkUrl,
  distinguishUrl,
} from "./constant";

const axios = require("axios");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const localizedFormat = require("dayjs/plugin/localizedFormat");
const { Readable } = require("stream");
const { FormDataEncoder } = require("form-data-encoder-old");
const { FormData } = require("formdata-node");
const { v4: uuidv4 } = require("uuid");

dayjs.extend(utc);
dayjs.extend(localizedFormat);

Math = Math as any;

// 随机从arr里选择一项
const randomChoice = (arr: Array<any>) =>
  arr[Math.floor(Math.random() * arr.length)];
// 区间随机选择
const rd = (num1: number, num2: number) => Math.random() * (num2 - num1) + num1;
// 随机ua
function random_ua() {
  return `Mozilla/5.0 (Windows NT ${randomChoice(
    uaArr
  )}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${randomChoice(
    versionArr
  )} Safari/537.36`;
}
//
async function requester(url: string, { method, headers, params, data }: any) {
  if (!headers) {
    headers = {
      Accept: "*/*",
      Connection: "close",
      "Accept-Encoding": "gzip, deflate, br",
      "User-Agent": random_ua(),
    };
  }
  return await axios.request({
    url,
    method,
    headers,
    params,
    data,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
}

async function getFile(url: string) {
  return (await axios.get(url, { responseType: "arraybuffer" })).data;
}

async function upload(url: string) {
  const file = await getFile(url);
  let formData = new FormData();
  formData.set("language", 1);
  formData.set("id", "WU_FILE_0");
  formData.set("name", `${uuidv4}.mp4`);
  formData.set("type", "video/mp4");
  formData.set(
    "lastModifiedDate",
    dayjs().utc().format("ddd MMM D YYYY HH:mm:ss") + " GMT+0800 (中国标准时间)"
  );
  formData.set("size", file.length);
  formData.append("file", file);
  const encoder = new FormDataEncoder(
    formData,
    "----WebKitFormBoundaryXlZUr7IUQezLdWKz"
  );

  return await requester(uploadUrl, {
    method: "post",
    params: {
      type: "whole",
      folder: rd(10000000000000000, 99999999999999999).toString(),
    },
    data: Readable.from(encoder.encode()),
    headers: {
      Host: "www.iflyrec.com",
      Connection: "close",
      "User-Agent": random_ua(),
      "X-Biz-Id": "xftj",
      "Content-Type": `multipart/form-data; boundary=----WebKitFormBoundaryXlZUr7IUQezLdWKz`,
      Accept: "*/*",
      Origin: "https://www.iflyrec.com",
      Referer: "https://www.iflyrec.com/html/addMachineOrder.html",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-CN,zh;q=0.9",
      DNT: "1",
      "sec-ch-ua": ` Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96`,
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": `"Windows"`,
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
    },
  });
}

async function crc32check(fileid: string, crc32: string) {
  const result = await requester(getCrc32checkUrl(fileid, crc32), {
    method: "post",
    headers: {
      Host: "www.iflyrec.com",
      Connection: "close",
      Accept: "application/json, text/javascript, */*; q=0.01",
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent": random_ua(),
      "X-Biz-Id": "xftj",
      Origin: "https://www.iflyrec.com",
      Referer: "https://www.iflyrec.com/html/addMachineOrder.html",
      "Accept-Encoding": "gzip, deflate",
      "Accept-Language": "zh-CN,zh;q=0.9",
    },
  });
  return result.data.code === "000000";
}

async function distinguish(path: string, method = "post") {
  const { data: result } = await requester(distinguishUrl, {
    method,
    headers: {
      Host: "www.iflyrec.com",
      Connection: "close",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36",
      "X-Biz-Id": "xftj",
      "Content-Type": "application/json;charset=UTF-8",
      Origin: "https://www.iflyrec.com",
      Referer: "https://www.iflyrec.com/html/addMachineOrder.html",
      "Accept-Encoding": "gzip, deflate",
      "Accept-Language": "zh-CN,zh;q=0.9",
    },
    params: {
      filePath: path,
      transcriptLanguage: 1,
    },
    ...(method === "post"
      ? {
          data: {
            filePath: path,
            transcriptLanguage: 1,
          },
        }
      : []),
  });
  return result;
}

async function doDistinguish(url: string) {
  const {
    data: {
      desc,
      biz: { fileId, crc32, transPreviewPath, uploadedSize },
    },
  } = await upload(url);
  if (desc === "success" && !(typeof uploadedSize === "number"))
    throw new Error("upload failed");
  if (await crc32check(fileId, crc32)) {
    await distinguish(transPreviewPath);
    let times = 0;
    const totalDegree = 10;
    return await new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        times++;
        let {
          biz: { transcriptResult },
        } = await distinguish(transPreviewPath, "get");
        if (transcriptResult) {
          resolve(JSON.parse(transcriptResult));
          clearInterval(interval);
        } else {
          if (times >= totalDegree) {
            reject({ status: false, msg: "转换失败" });
            clearInterval(interval);
          }
        }
      }, 3000);
    });
  }
}

export default doDistinguish;
