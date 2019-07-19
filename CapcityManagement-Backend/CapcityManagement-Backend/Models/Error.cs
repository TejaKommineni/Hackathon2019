using Newtonsoft.Json;

namespace CapcityManagement_Backend.Models
{
    public sealed class Error
    {
        [JsonProperty(PropertyName = "code")]
        public string Code { get; set; }

        [JsonProperty(PropertyName = "message")]
        public string Message { get; set; }

        [JsonProperty(PropertyName = "target", NullValueHandling = NullValueHandling.Ignore)]
        public string Target { get; set; }

        [JsonProperty(PropertyName = "details", NullValueHandling = NullValueHandling.Ignore)]
        public Error[] Details { get; set; }

        [JsonProperty(PropertyName = "innerError", NullValueHandling = NullValueHandling.Ignore)]
        public InnerError Innererror { get; set; }
    }

    public sealed class InnerError
    {
        [JsonProperty(PropertyName = "code")]
        public string Code { get; set; }

        [JsonProperty(PropertyName = "message")]
        public string Message { get; set; }

        [JsonProperty(PropertyName = "innerError", NullValueHandling = NullValueHandling.Ignore)]
        public InnerError Innererror { get; set; }
    }
}
