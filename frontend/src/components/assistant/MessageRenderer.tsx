import React from 'react';

interface MessageRendererProps {
  content: string;
  className?: string;
}

interface ParsedLine {
  type: 'h2' | 'h3' | 'h4' | 'li' | 'oli' | 'p' | 'hr' | 'empty' | 'table-row' | 'blockquote';
  content: string;
  index?: number;
}

function parseLine(line: string): ParsedLine {
  if (line.startsWith('#### ')) return { type: 'h4', content: line.slice(5) };
  if (line.startsWith('### ')) return { type: 'h3', content: line.slice(4) };
  if (line.startsWith('## ')) return { type: 'h2', content: line.slice(3) };
  if (line.startsWith('> ')) return { type: 'blockquote', content: line.slice(2) };
  if (line.startsWith('---')) return { type: 'hr', content: '' };
  const orderedMatch = line.match(/^(\d+)\.\s(.*)$/);
  if (orderedMatch) {
    return { type: 'oli', content: orderedMatch[2], index: parseInt(orderedMatch[1]) };
  }
  if (line.startsWith('- ') || line.startsWith('* ')) return { type: 'li', content: line.slice(2) };
  if (line.startsWith('| ')) return { type: 'table-row', content: line };
  if (line.trim() === '') return { type: 'empty', content: '' };
  return { type: 'p', content: line };
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold **text**
    const boldIdx = remaining.indexOf('**');
    if (boldIdx !== -1) {
      const boldEnd = remaining.indexOf('**', boldIdx + 2);
      if (boldEnd !== -1) {
        if (boldIdx > 0) {
          parts.push(<span key={key++}>{remaining.slice(0, boldIdx)}</span>);
        }
        parts.push(
          <strong key={key++} className="font-semibold">
            {remaining.slice(boldIdx + 2, boldEnd)}
          </strong>
        );
        remaining = remaining.slice(boldEnd + 2);
        continue;
      }
    }

    // Inline code `code`
    const codeIdx = remaining.indexOf('`');
    if (codeIdx !== -1) {
      const codeEnd = remaining.indexOf('`', codeIdx + 1);
      if (codeEnd !== -1) {
        if (codeIdx > 0) {
          parts.push(<span key={key++}>{remaining.slice(0, codeIdx)}</span>);
        }
        parts.push(
          <code key={key++} className="px-1 py-0.5 rounded text-xs font-mono bg-muted text-foreground">
            {remaining.slice(codeIdx + 1, codeEnd)}
          </code>
        );
        remaining = remaining.slice(codeEnd + 1);
        continue;
      }
    }

    parts.push(<span key={key++}>{remaining}</span>);
    break;
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

function renderTableRow(line: string, isHeader: boolean): React.ReactNode {
  const cells = line.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1);
  return cells.map((cell, i) =>
    isHeader ? (
      <th key={i} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide border-b border-border">
        {cell.trim()}
      </th>
    ) : (
      <td key={i} className="px-3 py-2 text-sm border-b border-border/50">
        {renderInline(cell.trim())}
      </td>
    )
  );
}

export function MessageRenderer({ content, className = '' }: MessageRendererProps) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let orderedItems: React.ReactNode[] = [];
  let tableRows: string[] = [];
  let inTable = false;
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="my-2 space-y-1 pl-4">
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  const flushOrdered = () => {
    if (orderedItems.length > 0) {
      elements.push(
        <ol key={key++} className="my-2 space-y-1 pl-4 list-decimal">
          {orderedItems}
        </ol>
      );
      orderedItems = [];
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0];
      const dataRows = tableRows.slice(2); // skip separator row
      elements.push(
        <div key={key++} className="my-3 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>{renderTableRow(headerRow, true)}</tr>
            </thead>
            <tbody>
              {dataRows.map((row, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  {renderTableRow(row, false)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  for (const line of lines) {
    const parsed = parseLine(line);

    // Handle table rows
    if (parsed.type === 'table-row') {
      flushList();
      flushOrdered();
      inTable = true;
      tableRows.push(line);
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (parsed.type === 'li') {
      flushOrdered();
      listItems.push(
        <li key={key++} className="flex items-start gap-2 text-sm leading-relaxed">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
          <span>{renderInline(parsed.content)}</span>
        </li>
      );
    } else if (parsed.type === 'oli') {
      flushList();
      orderedItems.push(
        <li key={key++} className="text-sm leading-relaxed">
          {renderInline(parsed.content)}
        </li>
      );
    } else {
      flushList();
      flushOrdered();

      if (parsed.type === 'h2') {
        elements.push(
          <h2 key={key++} className="text-base font-bold mt-4 mb-2 text-foreground first:mt-0">
            {renderInline(parsed.content)}
          </h2>
        );
      } else if (parsed.type === 'h3') {
        elements.push(
          <h3 key={key++} className="text-sm font-semibold mt-3 mb-1.5 text-foreground">
            {renderInline(parsed.content)}
          </h3>
        );
      } else if (parsed.type === 'h4') {
        elements.push(
          <h4 key={key++} className="text-sm font-medium mt-2 mb-1 text-muted-foreground">
            {renderInline(parsed.content)}
          </h4>
        );
      } else if (parsed.type === 'blockquote') {
        elements.push(
          <blockquote key={key++} className="my-2 pl-3 border-l-2 border-primary/50 text-sm text-muted-foreground italic">
            {renderInline(parsed.content)}
          </blockquote>
        );
      } else if (parsed.type === 'hr') {
        elements.push(<hr key={key++} className="my-3 border-border" />);
      } else if (parsed.type === 'empty') {
        // Skip — spacing handled by element margins
      } else if (parsed.type === 'p' && parsed.content.trim()) {
        elements.push(
          <p key={key++} className="text-sm leading-relaxed my-1">
            {renderInline(parsed.content)}
          </p>
        );
      }
    }
  }

  // Flush any remaining lists or tables
  flushList();
  flushOrdered();
  if (inTable) flushTable();

  return (
    <div className={'message-content ' + className}>
      {elements}
    </div>
  );
}

export default MessageRenderer;
