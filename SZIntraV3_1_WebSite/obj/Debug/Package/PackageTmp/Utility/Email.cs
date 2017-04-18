using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Mail;
using System.Net;
using System.Text;

namespace SZIntraV3_1_WebSite.Utility
{

    public enum ClientHost
    {
        GeExchange
    }

    public enum Credential
    {
        SuzhouAutoMail
    }

    public class Email
    {
        private const int TIMEOUT = 10000;

        public static Dictionary<Credential, NetworkCredential> Credentials = new Dictionary<Credential, NetworkCredential>()
        {
              {Credential.SuzhouAutoMail, new NetworkCredential("functional.suzhouautomail@ge.com", "Work44ge")}
        };

        public static Dictionary<ClientHost, string> ClientHosts = new Dictionary<ClientHost, string>()
        {
        {ClientHost.GeExchange, "mail.ad.ge.com"}
        };

        public static SmtpClient GetSuzhouAutoMailClient()
        {
            return GetClient(25, ClientHost.GeExchange, Credential.SuzhouAutoMail);
        }

        public static SmtpClient GetClient(int port, ClientHost host, Credential credential)
        {
            SmtpClient client = new SmtpClient();
            client.Port = port;
            client.Host = ClientHosts[host];
            client.EnableSsl = false;
            client.Timeout = TIMEOUT;
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.UseDefaultCredentials = false;
            client.Credentials = Credentials[credential];

            return client;
        }

        public static MailMessage BuildMailMessage(string from, string to, string subject, string body, Encoding encoding, bool isBodyHtml, DeliveryNotificationOptions option)
        {
            MailMessage mail = new MailMessage(from, to, subject, body);
            mail.BodyEncoding = encoding;
            mail.IsBodyHtml = isBodyHtml;
            mail.DeliveryNotificationOptions = option;

            return mail;
        }

      
    }
}