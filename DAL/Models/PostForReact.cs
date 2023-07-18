namespace DAL.Models
{
    public class PostForReact
    {
        public string Text { get; set; }
        public string Title { get; set; }
        public string Image { get; set; }
        public byte[] ByteImage { get; set; } = new byte[0];
    }
}
