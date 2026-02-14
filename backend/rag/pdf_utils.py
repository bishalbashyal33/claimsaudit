"""
PDF to Markdown conversion utility.
Uses pdfplumber to extract text and structure it as markdown headings.
"""
import pdfplumber
from typing import Union
from pathlib import Path

def convert_pdf_to_markdown(file_path: Union[str, Path]) -> str:
    """
    Extract text from PDF file path and format as markdown. 
    Simple heuristic: Assume bold/larger fonts are headers (simplified for demo).
    For now, just plain text extraction with page separation.
    
    Args:
        file_path: Path to the PDF file (string or Path object)
    
    Returns:
        Markdown-formatted text with page separators
    """
    markdown_output = []
    
    try:
        with pdfplumber.open(file_path) as pdf:
            for i, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text:
                    # Clean up the text and add as markdown section
                    markdown_output.append(f"## Page {i+1}\n\n{text}\n")
        
        return "\n".join(markdown_output) if markdown_output else "# Empty Document\n\nNo text content found."
    except Exception as e:
        raise ValueError(f"Failed to convert PDF to markdown: {str(e)}")
