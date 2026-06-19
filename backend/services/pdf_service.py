import markdown2
from weasyprint import HTML

_HTML_TEMPLATE_HEAD = """\
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {
    font-family: Arial, Helvetica, sans-serif;
    max-width: 750px;
    margin: 40px auto;
    color: #1e293b;
    font-size: 14px;
    line-height: 1.6;
  }
  h1 { font-size: 24px; color: #059669; border-bottom: 2px solid #059669;
       padding-bottom: 6px; margin-bottom: 4px; }
  h2 { font-size: 16px; color: #0f172a; margin-top: 20px; margin-bottom: 6px; }
  ul { padding-left: 18px; }
  li { margin-bottom: 4px; }
  p { margin: 4px 0; }
</style>
</head>
<body>
"""

_HTML_TEMPLATE_TAIL = """\

</body>
</html>"""


class PDFService:
    def generate_pdf(self, markdown_content: str) -> bytes:
        html_content = markdown2.markdown(markdown_content, extras=["fenced-code-blocks"])
        full_html = _HTML_TEMPLATE_HEAD + html_content + _HTML_TEMPLATE_TAIL
        return HTML(string=full_html).write_pdf()
