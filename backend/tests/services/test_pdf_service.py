from backend.services.pdf_service import PDFService


def test_generate_pdf_returns_bytes():
    service = PDFService()
    content = "# Eduardo Faleiro\n\n## Experiência\n- Python Developer"
    pdf = service.generate_pdf(content)
    assert isinstance(pdf, bytes)
    assert pdf[:4] == b"%PDF"


def test_generate_pdf_from_empty_markdown():
    service = PDFService()
    pdf = service.generate_pdf("")
    assert isinstance(pdf, bytes)
    assert pdf[:4] == b"%PDF"


def test_generate_pdf_renders_h1_as_name():
    service = PDFService()
    content = "# Maria Silva"
    pdf = service.generate_pdf(content)
    assert len(pdf) > 1000  # non-trivial PDF


def test_generate_pdf_handles_curly_braces_in_content():
    service = PDFService()
    content = "# Dev\n\nExample: `{\"key\": \"value\"}` and `{variable}`"
    pdf = service.generate_pdf(content)
    assert isinstance(pdf, bytes)
    assert pdf[:4] == b"%PDF"
