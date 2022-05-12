import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface ICommentCodeBLock {
  language: string;
  code: string;
}

const CommentCodeBlock = ({ language, code }: ICommentCodeBLock) => {
  return (
    <SyntaxHighlighter language={language} wrapLongLines="true" style={a11yDark}>
      {`${code}`}
    </SyntaxHighlighter>
  );
};

export default CommentCodeBlock;
