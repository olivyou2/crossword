class connectionRelate {
    constructor() {
        this.vline = undefined;
        this.from = 0;
        this.to = 0;
    }
}

class line {
    /**
     * 
     * @param {number} length 
     * @param {Array<connectionRelate>} connections 
     */
    constructor(length, index = "", connections = []) {
        this.length = length;
        this.word = "";
        this.connection = connections;
        this.index = index;
    }

    /**
     * 
     * @param {line} vline 
     * @param {number} from
     * @param {number} to
     */
    add(vline, from, to) {
        this.connection.push({
            vline,
            from,
            to,
        });
    }

    getLines() {
        let lines = [this];

        for (const connection of this.connection) {
            lines = lines.concat(connection.vline.getLines());
        }

        return lines;
    }
}

/**
 * 
 * @param {line} parentNode 
 * @param {number} depth 
 */
const inference = (sources, parentNode, depth = 0) => {
    const word = parentNode.word;
    let inferenceComplete = true;

    for (const connection of parentNode.connection) {
        const char = word[connection.from];

        let forComplete = true;
        for (const source of sources) {
            if (source.length === connection.vline.length) {
                if (source[connection.to] === char) {
                    connection.vline.word = source;

                    const result = inference(sources, connection.vline, depth + 1);

                    if (result) {
                        forComplete = false;
                        break;
                    }
                }
            }
        }

        if (sources.length === 0) {
            forComplete = false;
        }

        if (forComplete) {
            connection.vline.word = "";
            inferenceComplete = false;
            console.log(`depth ${depth} 추론실패 ${word}`);
            break;
        }
    }

    if (inferenceComplete) {
        return true;
    } else {
        return false;
    }
};

// Example

const sources = ["apple", "popcat", "asdcgih"];

let parentNode = new line(5, "w1", [
    {
        vline: new line(6, "h1", [
            {
                vline: new line(7, "w2"),
                from: 3,
                to: 3
            }
        ]),
        from: 1,
        to: 2
    }
]);

parentNode.word = "apple";

const inferenceResult = inference(sources, parentNode);
console.log(`Result -> ${inferenceResult}`);

const lines = parentNode.getLines();
for (const line of lines) {
    console.log(`${line.index} -> ${line.word}`);
}