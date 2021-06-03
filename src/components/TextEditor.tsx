import * as React from 'react'
import { withStyles, WithStyles, StyleRules } from '@material-ui/styles'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState, convertToRaw } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

import { debounce } from 'throttle-debounce'

const stylesheet: StyleRules = {
  editorWrapper: {
    marginTop: '1rem',
  },
  editor: {
    border: '1px solid #f1f1f1',
    // height: '300px',
    padding: '1rem',
    overflow: 'auto',
  },
  editorLinkPopup: {
    height: 'auto',
  },
  editorImagePopup: {
    left: '-100%',
  },
}

type Props = WithStyles<keyof typeof stylesheet> & {
  onChange: (val: string) => void // 입력 변경시 HTML로 변경된 데이터를 전달한다.
  content: string // HTML? Markdown?
}

type State = {
  editorState: EditorState
}

class TextEditor extends React.Component<Props, State> {
  static defaultProps = {}

  state: State = {
    editorState: EditorState.createEmpty(),
  }

  constructor(props: Props) {
    super(props)
  }

  componentDidMount() {
    // 전달된 HTML 문자열로 에디터를 초기화한다.
    this.setState({
      editorState: this.convertHTMLtoEditorState(this.props.content),
    })
  }

  convertHTMLtoEditorState(html: string): EditorState {
    const contentBlock = htmlToDraft(html)

    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      return editorState
    }

    return EditorState.createEmpty()
  }

  onEditorStateChange = (editorState:EditorState) => {
    this.setState({
      editorState,
    })

    // 상위 컴포넌트의 콜백을 실행한다.
    this.callOnChangeCb()
  }

  callOnChangeCb = debounce(400, () => {
    this.props.onChange(
      draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    )
  })

  render() {
    const { classes } = this.props
    return (
      <Editor
        localization={{
          locale: 'en',
        }}
        editorState={this.state.editorState}
        onEditorStateChange={this.onEditorStateChange}
        wrapperClassName={classes.editorWrapper}
        editorClassName={classes.editor}
        toolbar={{
          fontFamily: {
            options: ['Nanum Square', 'Arial', 'Georgia', 'Impact', 'Tahoma', 'Verdana'],
          },
          link: {
            popupClassName: classes.editorLinkPopup,
          },
          // image: {
          //   uploadCallback: this.uploadImageCallBack,
          //   alt: { present: false, mandatory: false },
          //   urlEnabled: true,
          //   uploadEnabled: false, // 현재 업로드 불가
          //   inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
          //   defaultSize: {
          //     height: 'auto',
          //     width: '100%',
          //   },
          // },
        }}
      />
    )
  }
}

export default withStyles(stylesheet)(TextEditor)