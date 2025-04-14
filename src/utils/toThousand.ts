function formatNumberToThousands(num: number): string {
    // 确保输入是数字
    if (isNaN(num)) {
        throw new Error("输入必须是一个有效的数字");
    }

    // 将数字转换为字符串并去掉小数点后的多余零
    const numString = num.toString().replace(/\.0$/, "");

    // 拆分成整数部分和小数部分
    const [integerPart, decimalPart] = numString.split("."); // 2345  7

    // 使用数组存储分隔后的整数部分
    let formattedInteger = "";

    // 反向遍历整数部分
    for (let i = integerPart.length - 1; i >= 0; i--) { //2345   i=3
        // 将字符添加到格式化结果中   2345.7
        formattedInteger = integerPart[i] + formattedInteger;//5+""

        // 每隔3位添加逗号
        if ((integerPart.length - i) % 3 === 0 && i !== 0) {
            formattedInteger = "," + formattedInteger;
        }
    }

    // 如果有小数部分，则返回完整格式
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}

export default formatNumberToThousands