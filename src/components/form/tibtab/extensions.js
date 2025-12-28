import { Color } from '@tiptap/extension-color';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
// load all languages with "all" or common languages with "common"
import { all, createLowlight } from 'lowlight';

import ImageResize from 'tiptap-extension-resize-image';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';

// create a lowlight instance
const lowlight = createLowlight(all);

// you can also register languages
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('ts', ts);

export const getExtensions = () => [
  StarterKit.configure({
    // CodeBlockLowlight를 사용
    codeBlock: false,
  }),
  Placeholder.configure({
    placeholder: 'Please enter your content.',
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  TaskList, // 반드시 추가
  TaskItem.configure({
    nested: true, // 중첩 리스트 허용 여부
  }),
  CodeBlockLowlight.configure({
    lowlight,
    enableTabIndentation: true, // 들여쓰기 활성화
    HTMLAttributes: {
      class: 'tiptab__codeblock',
    },
  }),
  Superscript,
  Subscript,
  Underline,
  Link,
  ImageResize.configure({
    inline: true,
  }),
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
];
