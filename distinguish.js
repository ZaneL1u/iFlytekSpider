const {
  uaArr,
  versionArr,
  uploadUrl,
  getCrc32checkUrl,
  distinguishUrl,
} = require("./constant");

const axios = require("axios");
const path = require("path");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const localizedFormat = require("dayjs/plugin/localizedFormat");
const { Readable } = require("stream");
const { FormDataEncoder } = require("form-data-encoder-old");
const { FormData } = require("formdata-node");
const { v4: uuidv4 } = require("uuid");

dayjs.extend(utc);
dayjs.extend(localizedFormat);

// 随机从arr里选择一项
Math.randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
// 区间随机选择
Math.rd = (num1, num2) => Math.random() * (num2 - num1) + num1;
// 随机ua
function random_ua() {
  return `Mozilla/5.0 (Windows NT ${Math.randomChoice(
    uaArr
  )}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${Math.randomChoice(
    versionArr
  )} Safari/537.36`;
}
//
async function requester(url, { method, headers, params, data }) {
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

async function getFile(url) {
  return (await axios.get(url, { responseType: "arraybuffer" })).data;
}

async function upload(url) {
  const file = new Blob([await getFile(url)]);
  console.log(file);
  let formData = new FormData();
  formData.set("language", 1);
  formData.set("id", "WU_FILE_0");
  formData.set("name", `${uuidv4}.mp4`);
  formData.set("type", "video/mp4");
  formData.set(
    "lastModifiedDate",
    dayjs()
      .utc()
      .format("ddd MMM D YYYY HH:mm:ss") + " GMT+0800 (中国标准时间)"
  );
  formData.set("size", file.length);
  formData.append("file", file);
  const encoder = new FormDataEncoder(
    formData,
    "----WebKitFormBoundaryXlZUr7IUQezLdWKz"
  );

  try {
    return await requester(uploadUrl, {
      method: "post",
      params: {
        type: "whole",
        folder: Math.rd(10000000000000000, 99999999999999999).toString(),
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
        Connection: "keep-alive",
        DNT: "1",
        "sec-ch-ua": ` Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96`,
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": `"Windows"`,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
      },
    });
  } catch (err) {
    console.log(err);
    throw new Error("上传失败！");
  }
}

async function crc32check(fileid, crc32) {
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

async function distinguish(path, method = "post") {
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

module.exports = {
  upload,
  crc32check,
  distinguish,
};
