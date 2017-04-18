using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using iTextSharp.text;
using iTextSharp.text.pdf;

namespace SZIntraV3_1_WebSite.Utility
{
    public class DRFooter : PdfPageEventHelper
    {
        public string dr_num= "N/A";
        public DRFooter(string dr_num)
        {
            this.dr_num = dr_num;
        }
      
        Font font = BaseFontAndSize("黑体", 10, Font.NORMAL, BaseColor.BLACK);

        PdfTemplate template;
        //定义字体 颜色
        public static Font BaseFontAndSize(string font_name, int size, int style, BaseColor baseColor)
        {
            BaseFont baseFont;
            BaseFont.AddToResourceSearch("iTextAsian.dll");
            BaseFont.AddToResourceSearch("iTextAsianCmaps.dll");
            Font font = null;
            string file_name = "SIMHEI.TTF";
            int fontStyle;
            switch (font_name)
            {
                case "黑体":
                    file_name = "SIMHEI.TTF";
                    break;
                default:
                    file_name = "SIMYOU.TTF";
                    break;
            }

       //    string a = System.Diagnostics.Process.GetCurrentProcess().MainModule.FileName;

            baseFont = BaseFont.CreateFont(HttpContext.Current.Server.MapPath(@"~\Files\" + file_name), BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED);//字体：黑体

            fontStyle = Font.NORMAL;
            font = new Font(baseFont, size, fontStyle, baseColor);
            return font;
        }




        /**
        * Initialize one of the headers.
        * @see com.itextpdf.text.pdf.PdfPageEventHelper#onOpenDocument(
        *      com.itextpdf.text.pdf.PdfWriter, com.itextpdf.text.Document)
        */
        public override void OnOpenDocument(PdfWriter writer, Document document)
        {
            base.OnOpenDocument(writer, document);
            //header[0] = new Phrase("Movie history");
            template = writer.DirectContent.CreateTemplate(20, 20);
        }
        /**
        * Increase the page number.
        * @see com.itextpdf.text.pdf.PdfPageEventHelper#onStartPage(
        *      com.itextpdf.text.pdf.PdfWriter, com.itextpdf.text.Document)
        */
        public override void OnStartPage(PdfWriter writer, Document document)
        {
            base.OnStartPage(writer, document);
          //  pagenumber++;
            writer.PageCount = writer.PageNumber;
        }

        /**
         * Adds the header and the footer.
         * @see com.itextpdf.text.pdf.PdfPageEventHelper#onEndPage(
         *      com.itextpdf.text.pdf.PdfWriter, com.itextpdf.text.Document)
         */
        public override void OnEndPage(PdfWriter writer, Document document)
        {
         //   Rectangle rect = writer.GetBoxSize("footer");
         ////   ColumnText.ShowTextAligned(writer.DirectContent, Element.ALIGN_LEFT, new Phrase("Discrepancy Record: " + dr_num), rect.Left, 5, 0);
         //   ColumnText.ShowTextAligned(writer.DirectContent, Element.ALIGN_RIGHT, new Phrase("Discrepancy Record: " + dr_num + "   第" + (writer.PageNumber) + "页",font), rect.Right - 30, 5, 0);
         //   //writer.DirectContent.AddTemplate(template, rect.Right, 5);
         //   //@float x 距离左边
         //   //@float y 距离底边
         //   //(rect.Left + rect.Right) / 2, rect.Bottom - 18



            Phrase footer = new Phrase("Discrepancy Record: " + dr_num + "        第" + (writer.PageNumber) + "页/共     页", font);
            PdfContentByte cb = writer.DirectContent;

            //模版 显示总共页数  
            cb.AddTemplate(template, document.Right - 55 + document.LeftMargin, document.Bottom - 10);//调节模版显示的位置

            //页脚显示的位置
            ColumnText.ShowTextAligned(cb, Element.ALIGN_CENTER, footer,
            document.Right - 162 + document.LeftMargin, document.Bottom - 10, 0);

        }

        public override void OnCloseDocument(PdfWriter writer, Document document)
        {


            BaseFont bf = BaseFont.CreateFont(HttpContext.Current.Server.MapPath(@"~\Files\SIMHEI.TTF"), BaseFont.IDENTITY_H, false); //调用的字体
            template.BeginText();
            template.SetFontAndSize(bf, 12);//生成的模版的字体、颜色
            template.ShowText((writer.PageNumber - 1).ToString());//模版显示的内容
            template.EndText();
            template.ClosePath();

        }

    }
}