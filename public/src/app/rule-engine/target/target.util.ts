export function getBranchRequierds(node, requiredArr) {
  if (node.parent) {
    if (node.parent.data.hasOwnProperty('requiredChildren')) {
      requiredArr.push(node.parent.data.requiredChildren);
    }
    return getBranchRequierds(node.parent, requiredArr);
  }
  return requiredArr;
}

export function validation(node, userSelection) {
  const requiredArr = [];
  const validationRequired = getBranchRequierds(node, requiredArr);
  const nonValidationArr = [];
  validationRequired.forEach(nodeRequireds => {
    return nodeRequireds.forEach(levelRequired => {
      if (userSelection.filter(node => node === levelRequired).length === 0) {
        nonValidationArr.push(levelRequired);
      }
      return;
    });
  });
  return nonValidationArr;
}

export function fuzzysearch(needle, haystack) {
  const haystackLC = haystack.toLowerCase();
  const needleLC = needle.toLowerCase();

  const hlen = haystack.length;
  const nlen = needleLC.length;

  if (nlen > hlen) {
    return false;
  }
  if (nlen === hlen) {
    return needleLC === haystackLC;
  }
  outer: for (let i = 0, j = 0; i < nlen; i++) {
    const nch = needleLC.charCodeAt(i);

    while (j < hlen) {
      if (haystackLC.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}
