export function UniqueId() {
  return ObjectIdToHexString(NewObjectId());
}

export function RandomString(length) {
  const chars =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const timestamp = (new Date().getTime() / 1000 || 0)
    .toString(16)
    .replace('.', '');
  let result = timestamp;
  if (result.length > length) {
    result = result.substring(0, length);
  } else if (result.length < length) {
    for (let i = length - result.length; i > 0; --i) {
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    }
  }
  return result;
}

export function ChunkArray(inputArray, itemsInChunk) {
  return inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / itemsInChunk);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);
}

export function NthIndexOfString(string, subString, index) {
  let i = -1;
  while (index-- && i++ < string.length) {
    i = string.indexOf(subString, i);
    if (i < 0) {
      break;
    }
  }
  return i;
}

function getRandomValues(array: any[]) {
  return array.map(() => Math.floor(Math.random() * 256));
}

// implementation of MongoDB ObjectId
export function NewObjectId(): Buffer {
  let kId: Buffer;
  kId = GenerateObjectId();
  return kId;
}
// eslint-disable-next-line no-bitwise
let index = ~~(Math.random() * 0xffffff);

function GetIncObjectId() {
  return (index = (index + 1) % 0xffffff);
}

function GenerateObjectId(): Buffer {
  // eslint-disable-next-line no-bitwise
  const time = ~~(Date.now() / 1000);
  const inc = GetIncObjectId();
  const buffer = Buffer.alloc(12);

  // 4-byte timestamp
  buffer.writeUInt32BE(time, 0);

  const PROCESS_UNIQUE = getRandomValues(Buffer.alloc(5));

  // 5-byte process unique
  buffer[4] = PROCESS_UNIQUE[0];
  buffer[5] = PROCESS_UNIQUE[1];
  buffer[6] = PROCESS_UNIQUE[2];
  buffer[7] = PROCESS_UNIQUE[3];
  buffer[8] = PROCESS_UNIQUE[4];

  // 3-byte counter
  // eslint-disable-next-line no-bitwise
  buffer[11] = inc & 0xff;
  // eslint-disable-next-line no-bitwise
  buffer[10] = (inc >> 8) & 0xff;
  // eslint-disable-next-line no-bitwise
  buffer[9] = (inc >> 16) & 0xff;

  return buffer;
}

export function ObjectIdToHexString(objectId: Buffer): string {
  return objectId.toString('hex');
}
