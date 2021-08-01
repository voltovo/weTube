### BLOB

_blob ???_

- Binary Large Object의 약자
- image, video, audio 같은 멀티미디어 객체

#### 1. 구조

```javaScript
var mBlob = new Blob(array, options);
```

- array : ArrayBuffer, ArrayBufferView, Blob, DOMStrring 중의 하나로 데이터의 배열을 전달.
- options : type, endings 의 형태를 가직고 있다.  
  type는 MIME Type(application/octet-stream, text/plain ...)  
  endings는 native(사용중인 OS에 맞춰 줄바꿈 문자를 사용)  
  transparent(사용하던 줄바꿈 문자를 그대로 사용 DEFAULT)

- 예시

```javaScript
var htmlCode = ['<!Doctype html>', 'Hello, World'];
var htmlBlob - new Blob(htmlCode, {
    type: 'text/html',
    endings: transparent
})
```

#### 2.Blob URL

blob 객체를 URL을 통해 접근 가능

```
window.URL.createBlobURL(mBlob);
```

#### 3. Blob Method

- slice
  지정된 바이트 범위의 데이터를 포함하는 새로운 Blob 객체를 만드는 데 사용됩니다.
  10MB 이상 사이즈가 큰 Blob 객체를 작게 조각내어 사용할 때 유용

```javaScript
const blob = new Blob();  // New blob object
blob.slice(start, end, type);
```

start는 시작 범위(Byte, Number), end는 종료 범위(Byte, Number), type은 새로운 Blob 객체의 MIME 타입(String)을 지정합니다.
