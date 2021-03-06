﻿using System.IO;
using OfficeOpenXml;

namespace Service.Data.Core.Class
{
    public class CMixExcel
    {
        private ExcelPackage _excelPackage;
        //private HSSFWorkbook _HSSFWorkbook;
        public bool IsUpperVer2003 = false;
        public string PathFile = string.Empty;
        private FileStream _fStream;
        public object ExcelMixCore
        {
            get
            {
                return _excelPackage;
                
            }
        }

        public CMixExcel()
        {
            //if (IsUpperVer2003)
                _excelPackage = new ExcelPackage();
            //else
            //    _HSSFWorkbook = new HSSFWorkbook();
        }

        public CMixExcel(Stream s)
        {
            //if (IsUpperVer2003)
                _excelPackage = new ExcelPackage(s);
            //else
            //    _HSSFWorkbook = new HSSFWorkbook(s);
        }

        public CMixExcel(string pathFile, bool openWrite = false)
        {
            if (openWrite)
            {
                _fStream = new FileStream(pathFile, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite);
            }
            else
            {
                _fStream = new FileStream(pathFile, FileMode.Open, FileAccess.Read, FileShare.Read);
            }

            if (_fStream.Name.EndsWith(".xlsx"))
                IsUpperVer2003 = true;

            //if (IsUpperVer2003)
                _excelPackage = new ExcelPackage(_fStream);
            //else
            //    _HSSFWorkbook = new HSSFWorkbook(_fStream);

            PathFile = pathFile;
        }

        public void CloseStream()
        {
            if (_fStream != null)
            {
                _fStream.Flush();
                _fStream.Close();
                _fStream = null;
            }
        }
    }
}