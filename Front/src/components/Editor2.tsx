import { useState } from 'react';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import MDEditor, { MDEditorProps } from '@uiw/react-md-editor';




const Editor = () => {
    const [state] = useState<MDEditorProps>({
        visibleDragbar: true,
        hideToolbar: true,
        overflow: true,
        highlightEnable: false,
        enableScroll: false,
        value: '',
        preview: 'live',
        toolbarBottom: false,
    });

    const [name, setName] = useState<string|undefined>('');
    const [value, setValue] = useState<string|undefined>('');
    const handleSend = () => {
        console.log(name, value)
    }
    

    return (
        <div className='editor'>
            <input value={name} onChange={(e) => setName(e.target.value)} />
            <MDEditor
                autoFocus
                value={value}
                overflow={state.overflow}
                previewOptions={{
                    linkTarget: '_blank',
                    rehypePlugins: [
                        [
                            rehypeSanitize,
                            {
                                ...defaultSchema,
                                attributes: {
                                    ...defaultSchema.attributes,
                                    span: [
                                        // @ts-ignore
                                        ...(defaultSchema.attributes.span || []),
                                        // List of all allowed tokens:
                                        ['className'],
                                    ],
                                    code: [['className']],
                                },
                            },
                        ],
                    ],
                }}
                height={400}
                highlightEnable={state.highlightEnable}
                hideToolbar={!state.hideToolbar}
                enableScroll={state.enableScroll}
                toolbarBottom={state.toolbarBottom}
                visibleDragbar={state.visibleDragbar}
                textareaProps={{ placeholder: 'Please enter Markdown text' }}
                preview={'live'}
                extraCommands={[]}
                onChange={(val : string|undefined) => setValue(val)}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default Editor;