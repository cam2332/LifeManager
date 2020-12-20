export function UniqueId() {
  return RandomString(24);
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
