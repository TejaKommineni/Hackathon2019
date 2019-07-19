using Newtonsoft.Json;
using System.Net;

namespace CapcityManagement_Backend.Models
{
    public class HttpResponse<T>
    {
        public HttpStatusCode StatusCode { get; set; }

        public T Content { get; set; }

        public Error Error { get; set; }
    }
}
