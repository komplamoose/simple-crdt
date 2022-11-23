import React, {useCallback, useEffect, useMemo, useState} from 'react';
import SimpleMDEReact from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import SimpleMDE from 'easymde';
import CodeMirror from 'codemirror';

function App() {
  const [editor, setEditor] = useState<CodeMirror.Editor | null>(null);
  useEffect(() => {
    editor?.on('beforeChange', (instance: CodeMirror.Editor, change: CodeMirror.EditorChange) => {
      const from = editor.indexFromPos(change.from);
      const to = editor.indexFromPos(change.to);
      const content = change.text.join('\n');

      console.log('ORIGIN', change.origin);
      console.log(from, to, content);
    });
  }, [editor]);

  const options = useMemo(() => {
    return {
      autofocus: true,
      spellChecker: false
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
