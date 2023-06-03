import React from 'react';
import { Skeleton } from 'antd';
import ReactMarkdown from 'react-markdown';
import { CopyFilled, SoundOutlined } from '@ant-design/icons';
import RemarkMath from 'remark-math';
import RehypeKatex from 'rehype-katex';
import RemarkGfm from 'remark-gfm';
import RemarkBreaks from 'remark-breaks';
import RehypeHighlight from 'rehype-highlight';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // 代码高亮主题风格
import useSpeechSynthesis from '@/hooks/useSpeechSynthesis';
import type { IConfig } from '@views/GlobalContext';

import './index.less';

interface IAiBubble {
  keyIndex: string;
  content: string;
  loading: boolean;
  config: IConfig;
}

function AiBubble(props: IAiBubble) {
  const { keyIndex, content, loading, config, isMobile } = props;

  const changeLang = (event) => {
    setLang(event.target.value);
  };

  const onEnd = () => {
    // You could do something here after speaking has finished
  };

  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({
    onEnd,
  });

  const onSpeck = () => {
    if (speaking) {
      cancel();
    } else {
      speak({
        text: content,
        voice: voices[config.speakLang],
        rate: config.rate,
        pitch: config.pitch,
      });
    }
  };

  return (
    <div
      className="ai-bubble flex items-start justify-start gap-3 my-3 relative overflow-hidden"
      key={keyIndex}
      style={{ maxWidth: '100%' }}
    >
      <img src="/ai.svg" className="w-8 mt-2"></img>
      {loading && !content ? (
        <Skeleton.Input active />
      ) : (
        <div
          className="rounded-xl p-4 text-gray-600 bg-slate-100 relative"
          style={{ maxWidth: '80%' }}
        >
          <ReactMarkdown
            children={content}
            remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
            rehypePlugins={[RehypeKatex]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return (
                  <span
                    className="code-block w-full overflow-auto scroll-style"
                    style={{ position: 'relative' }}
                  >
                    {!inline && match ? (
                      <>
                        <SyntaxHighlighter
                          showLineNumbers={true}
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                        <CopyFilled
                          className="code-copy-icon cursor-pointer absolute right-7 top-7 text-gray-300 "
                          onClick={() => onCopy(children[0])}
                        />
                      </>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )}
                  </span>
                );
              },
            }}
          />
          <SoundOutlined
            onClick={onSpeck}
            className={`speak-icon absolute text-xl ${
              (speaking || isMobile) && 'speak-icon-show'
            } `}
            style={{ right: -30, top: 5 }}
          />
        </div>
      )}
    </div>
  );
}

export default AiBubble;