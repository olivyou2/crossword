# Crossword Solver
#### *십자말풀이를.. 쉽게 풀어보자..~*

# Module
## Installation
````bash
git clone https://github.com/olivyou2/crossword

# React Front 설치
cd "crossword/Crossword Site"
npm install
````

## Functions
#### class connectionRelate
connectionRelate 는 다음과 같이 구성되어 있습니다. 부모 line 에서 자식 line 과의 관계를 나타내는 class 로, 부모 line 은 객체 내부에 구현되지 않습니다. 부모 line 의 from 번째 문자와 자식 line 의 to 번째 문자가 연결됩니다
````js
class connectionRelate {
  constructor() {
    this.vline = undefined;
    this.from = 0;
    this.to = 0;
  }
}
````

#### class line
line 은 다음과 같이 구성되어 있습니다
````js
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
  add(vline, from, to);
  

  /**
   * 
   * @returns line[]
   */
  getLines()
}
````

````js
line.length; // 단어 길이
line.word; // 단어
line.connection; // 단어 연결관계 어래이
line.index; // 단어 고유 인덱스

line.add(vline, from, to); // line 과 vline 의 연결관계를 line 에 추가합니다.
line.getLines(); // line 에 연결되어있는 관계들을 전부 return 합니다
````

#### function inference
십자말풀이를 추론합니다.

````js
inference(sources, parentNode, depth? = 0);
````
sources 는 추론할 단어가 들어있는 단어 리스트입니다. parentNode 는 추론을 시작할 line node 의 뿌리노드입니다. depth 는 inference 함수가 추론을 진행하면서, 재귀적으로 inference 를 재호출할 때 마다 1씩 증가합니다. API 상에서 inference 함수를 호출할 때, depth 를 지정하지 않으면 default 값이 0으로 지정됩니다.

# Front
Front 에 사용하는 crossword.js 는 ES5의 format 을 취하기 위해, src/lib 에 ES5의 format 을 취해 약간 수정해 파일이 작성되어 있습니다.

## Getting Start
````bash
npm start
````

## How to use
#### node 추가
루트노드의 칸을 마우스로 선택하면 prompt 가 화면에 나타나고, from 과 to 를 지정하여 node 를 추가할 수 있습니다. 

#### sources 지정
'i' 버튼을 눌러 sources 에 사용할 JSON 값을 지정합니다. JSON 값을 지정하면 자동으로 추론작업이 진행됩니다. JSON 값은 다음과 같은 포맷을 지니고 있어야 합니다.
````json
[
  "word1",
  "word2",
  "word3",
  "..."
]
````
포맷이 json 의 형태를 취하지 않으면 throw 합니다. 
