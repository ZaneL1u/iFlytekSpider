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
const fs = require("fs");

dayjs.extend(utc);
dayjs.extend(localizedFormat);

// 随机从arr里选择一项
Math.randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

Math.rd = function (num1, num2) {
  return Math.random() * (num2 - num1) + num1;
};

function random_ua() {
  return `Mozilla/5.0 (Windows NT ${Math.randomChoice(
    uaArr
  )}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${Math.randomChoice(
    versionArr
  )} Safari/537.36`;
}

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
  });
}

function getCode(code) {
  if (code && code.length === 16) {
    return code;
  }
  return "s4Qyl0knnW8pjpDK";
}

function getFileSize(file_path) {
  return fs.statSync(file_path).size;
  /*
  var fs = require("fs");
fs.stat("./JShaman.db",function(error,stats){
if(error){
callback("file size error");
}else{
//文件大小
callback(stats.size);
}
})
  
  */
}

async function upload(file_path) {
  const file = fs.readFileSync(file_path);
  let formData = new FormData();
  formData.set("language", 1);
  formData.set("id", "WU_FILE_0");
  formData.set("name", path.basename(file_path));
  formData.set("type", "video/mp4");
  formData.set(
    "lastModifiedDate",
    dayjs().utc().format("ddd MMM D YYYY HH:mm:ss") + " GMT+0800 (中国标准时间)"
  );
  formData.set("size", getFileSize(file_path));
  formData.append("file", file);
  const encoder = new FormDataEncoder(
    formData,
    "----WebKitFormBoundaryXlZUr7IUQezLdWKz"
  );
  const req = requester(uploadUrl, {
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
  return await req;
}

async function crc32check(fileid, crc32) {
  return await requester(getCrc32checkUrl(fileid, crc32), {
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
}

async function distinguish(path, isGet) {
  return await requester(distinguishUrl, {
    method: isGet ? "get" : "post",
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
    params: { filePath: path, transcriptLanguage: 1 },
    data: !isGet ? { filePath: path, transcriptLanguage: 1 } : undefined,
  });
}

upload("C:\\Users\\asus\\Desktop\\test.mp4")
  .then((e) => {
    console.log(e.data);
  })
  .catch((error) => {
    console.log(error.error);
  });
