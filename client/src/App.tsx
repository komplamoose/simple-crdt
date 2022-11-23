import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import SimpleMDEReact from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import SimpleMDE from 'easymde';
import CodeMirror from 'codemirror';
import CRDT from './crdt/crdt';

function App() {
  const [editor, setEditor] = useState<CodeMirror.Editor | null>(null);
  const crdtRef = useRef<CRDT>(new CRDT());

  useEffect(() => {
    editor?.on(
      'beforeChange',
      (instance: CodeMirror.Editor, change: CodeMirror.EditorChange) => {
        if (change.origin === 'setValue') return;
        const from = editor.indexFromPos(change.from);
        const to = editor.indexFromPos(change.to); // 여러 글자 insert시 다름
        const content = change.text.join('\n');
        switch (change.origin) {
          case '+input':
          case '*compose': // 한글은 합성 처리
            crdtRef.current.localInsert(from, content);
            break;
          case '+delete':
            crdtRef.current.localDelete(from, to);
            console.log('delete');
            break;
          default:
        }
        console.log('crdt: ', crdtRef.current.toString());
        console.log('ORIGIN', change.origin);
        console.log(from, to, content);
      }
    );
  }, [editor]);

  const options = useMemo(() => {
    return {
      autofocus: true,
      spellChecker: false,
    } as SimpleMDE.Options;
  }, []);

  const getCmInstanceCallback = useCallback((cm: CodeMirror.Editor) => {
    setEditor(cm);
  }, []);

  return (
    <SimpleMDEReact
      options={options}
      getCodemirrorInstance={getCmInstanceCallback}
    />
  );
}

export default App;
