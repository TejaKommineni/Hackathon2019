using System;
using CapcityManagement_Backend.Models;
using System.Net;

namespace CapcityManagement_Backend.Services
{
    public static class HttpResponseFactory
    {
        public static HttpResponse<T> CreateOKResponse<T>(T content)
        {
            return new HttpResponse<T>
            {
                Content = content,
                StatusCode = HttpStatusCode.OK
            };
        }

        public static HttpResponse<T> CreateInternalServerErrorResponse<T>(string message, Exception ex)
        {
            return CreateErrorResponse<T>(message, ex, HttpStatusCode.InternalServerError);
        }

        public static HttpResponse<T> CreateBadRequestErrorResponse<T>(string message, Exception ex)
        {
            return CreateErrorResponse<T>(message, ex, HttpStatusCode.BadRequest);
        }

        public static HttpResponse<T> CreateUnauthorizedErrorResponse<T>(string message, Exception ex)
        {
            return CreateErrorResponse<T>(message, ex, HttpStatusCode.Unauthorized);
        }

        public static HttpResponse<T> CreateNotFoundErrorResponse<T>(string message, Exception ex)
        {
            return CreateErrorResponse<T>(message, ex, HttpStatusCode.NotFound);
        }

        public static HttpResponse<T> CreateErrorResponse<T>(string message, Exception ex, HttpStatusCode statusCode)
        {
            return new HttpResponse<T>
            {
                Error = new Error
                {
                    Code = statusCode.ToString(),
                    Message = message,
                    Innererror = new InnerError
                    {
                        Code = ex.GetType().ToString(),
                        Message = ex.ToString()
                    }
                },
                StatusCode = statusCode
            };
        }
    }
}
