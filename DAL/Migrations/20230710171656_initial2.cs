using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class initial2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_news",
                table: "news");

            migrationBuilder.RenameTable(
                name: "news",
                newName: "News");

            migrationBuilder.AddPrimaryKey(
                name: "PK_News",
                table: "News",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_News",
                table: "News");

            migrationBuilder.RenameTable(
                name: "News",
                newName: "news");

            migrationBuilder.AddPrimaryKey(
                name: "PK_news",
                table: "news",
                column: "Id");
        }
    }
}
