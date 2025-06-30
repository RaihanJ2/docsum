import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import path from "path";
import fs from "fs";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.name) {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    let text = "";
    const fileName = file.name.toLowerCase();

    try {
      if (fileName.endsWith(".pdf")) {
        // Handle PDF files
        console.log("Processing PDF file:", file.name);
        const pdfData = await pdfParse(buffer);
        text = pdfData.text;

        if (!text || text.trim().length === 0) {
          return NextResponse.json(
            {
              error:
                "No text could be extracted from the PDF. The file might be image-based or corrupted.",
            },
            { status: 400 }
          );
        }
      } else if (fileName.endsWith(".txt")) {
        // Handle TXT files
        console.log("Processing TXT file:", file.name);
        text = buffer.toString("utf-8");

        if (!text || text.trim().length === 0) {
          return NextResponse.json(
            { error: "The text file appears to be empty." },
            { status: 400 }
          );
        }
      } else if (fileName.endsWith(".docx")) {
        // Handle DOCX files
        console.log("Processing DOCX file:", file.name);
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;

        if (result.messages && result.messages.length > 0) {
          console.warn("Mammoth warnings:", result.messages);
        }

        if (!text || text.trim().length === 0) {
          return NextResponse.json(
            { error: "No text could be extracted from the DOCX file." },
            { status: 400 }
          );
        }
      } else if (fileName.endsWith(".doc")) {
        // Handle DOC files (legacy Word format)
        // Note: mammoth primarily supports DOCX, DOC support is limited
        console.log("Processing DOC file:", file.name);
        try {
          const result = await mammoth.extractRawText({ buffer });
          text = result.value;

          if (!text || text.trim().length === 0) {
            return NextResponse.json(
              {
                error:
                  "Could not extract text from DOC file. Please convert to DOCX or PDF format.",
              },
              { status: 400 }
            );
          }
        } catch (docError) {
          console.error("DOC processing error:", docError);
          return NextResponse.json(
            {
              error:
                "DOC format is not fully supported. Please convert to DOCX or PDF format.",
            },
            { status: 400 }
          );
        }
      } else {
        // Unsupported file type
        const supportedTypes = [".pdf", ".txt", ".docx", ".doc"];
        return NextResponse.json(
          {
            error: `Unsupported file type. Supported formats: ${supportedTypes.join(
              ", "
            )}`,
            supportedTypes,
          },
          { status: 400 }
        );
      }

      // Additional validation
      if (text.length > 1000000) {
        // 1MB text limit
        return NextResponse.json(
          {
            error:
              "File too large. Please use a smaller document (max 1MB of text).",
          },
          { status: 413 }
        );
      }

      // Clean up the extracted text
      text = text
        .replace(/\r\n/g, "\n") // Normalize line endings
        .replace(/\n{3,}/g, "\n\n") // Remove excessive line breaks
        .trim();

      console.log(
        `Successfully extracted ${text.length} characters from ${file.name}`
      );

      return NextResponse.json({
        text,
        metadata: {
          fileName: file.name,
          fileSize: buffer.length,
          textLength: text.length,
          fileType: fileName.split(".").pop().toUpperCase(),
        },
      });
    } catch (fileProcessingError) {
      console.error(`Error processing ${fileName}:`, fileProcessingError);

      // Provide specific error messages based on file type
      if (fileName.endsWith(".pdf")) {
        return NextResponse.json(
          {
            error:
              "Failed to process PDF. The file might be corrupted or password-protected.",
          },
          { status: 500 }
        );
      } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
        return NextResponse.json(
          {
            error:
              "Failed to process Word document. The file might be corrupted.",
          },
          { status: 500 }
        );
      } else {
        return NextResponse.json(
          {
            error:
              "Failed to process the file. Please check if the file is valid.",
          },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("General error in extract-text:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your file." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    supportedTypes: [".pdf", ".txt", ".docx", ".doc"],
    maxFileSize: "10MB",
    maxTextLength: "1MB",
  });
}

// Test function to check if test file exists (remove this in production)
export async function testFileAccess() {
  try {
    const testFilePath = path.join(
      process.cwd(),
      "test",
      "data",
      "05-versions-space.pdf"
    );
    console.log("Checking file at:", testFilePath);

    if (fs.existsSync(testFilePath)) {
      console.log("✅ Test file exists");
      const stats = fs.statSync(testFilePath);
      console.log("File size:", stats.size, "bytes");
      return true;
    } else {
      console.log("❌ Test file does not exist");

      // Check what files are available in test directory
      const testDir = path.join(process.cwd(), "test");
      if (fs.existsSync(testDir)) {
        console.log("Test directory exists. Contents:");
        const contents = fs.readdirSync(testDir, { recursive: true });
        console.log(contents);
      } else {
        console.log("Test directory does not exist");
        console.log("Available directories in project root:");
        const rootContents = fs.readdirSync(process.cwd());
        console.log(rootContents);
      }
      return false;
    }
  } catch (error) {
    console.error("Error checking test file:", error);
    return false;
  }
}
