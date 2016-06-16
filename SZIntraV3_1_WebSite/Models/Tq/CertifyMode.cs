using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SZIntraV3_1_WebSite.Models.Tq
{
    public enum CertifyMode
    {
        Refresh, //表示这个技能是通过刷新获得的
        Normal,//表示这技能是走正常流程获得的
        Direct,//表示这个是直接授权员工的技能认证
        Npi //表示是Npi授权的技能
    }
}