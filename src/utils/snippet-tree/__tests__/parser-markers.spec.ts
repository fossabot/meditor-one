import { parse } from '@/utils/snippet-tree';

describe('Unit: Parser Markers', () => {
  it('should have identical markers on a snippet when it only has a single node', () => {
    let ast = parse('Text');
    let node = ast.body[0];

    expect(ast.columnStart).toBe(node.columnStart);
    expect(ast.columnEnd).toBe(node.columnEnd);
    expect(ast.lineStart).toBe(node.lineStart);
    expect(ast.lineEnd).toBe(node.lineEnd);
  });

  // It should keep track of comments

  // It should keep track of removed escape chararcters

  // It
});