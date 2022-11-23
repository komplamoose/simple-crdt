import React, { useCallback, useEffect, useMemo, useState } from 'react';
import SimpleMDEReact from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import SimpleMDE from 'easymde';
import CodeMirror from 'codemirror';
import CRDT from './crdt/crdt';

function App() {
  const [editor, setEditor] = useState<CodeMirror.Editor | null>(null);

  // const crdt = new CRDT();
  // crdt.localInsert(0, 'A');
  // crdt.localInsert(1, 'B');
  // crdt.localInsert(2, 'C');
  // crdt.localInsert(3, 'D');
  // crdt.localInsert(2, 'E');
  // console.log(crdt.toString());

  useEffect(() => {
    editor?.on(
      'beforeChange',
      (instance: CodeMirror.Editor, change: CodeMirror.EditorChange) => {
        const from = editor.indexFromPos(change.from);
        const to = editor.indexFromPos(change.to); // <- ?? 뭐에요?
        const content = change.text.join('\n');

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
