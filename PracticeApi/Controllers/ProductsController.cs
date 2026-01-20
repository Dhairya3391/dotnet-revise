using Microsoft.AspNetCore.Mvc;
using PracticeApi.Models;

namespace PracticeApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    // In-memory data store for practice
    private static List<Product> _products = new()
    {
        new Product { Id = 1, Name = "Laptop", Price = 999.99m, Category = "Electronics", Stock = 50 },
        new Product { Id = 2, Name = "Mouse", Price = 29.99m, Category = "Electronics", Stock = 200 },
        new Product { Id = 3, Name = "Keyboard", Price = 79.99m, Category = "Electronics", Stock = 150 },
        new Product { Id = 4, Name = "Desk Chair", Price = 249.99m, Category = "Furniture", Stock = 30 },
        new Product { Id = 5, Name = "Monitor", Price = 399.99m, Category = "Electronics", Stock = 75 }
    };

    // GET: api/products
    [HttpGet]
    public ActionResult<IEnumerable<Product>> GetAll()
    {
        return Ok(_products);
    }

    // GET: api/products/5
    [HttpGet("{id}")]
    public ActionResult<Product> GetById(int id)
    {
        var product = _products.FirstOrDefault(p => p.Id == id);
        if (product == null)
            return NotFound(new { message = "Product not found" });
        
        return Ok(product);
    }

    // GET: api/products/category/Electronics
    [HttpGet("category/{category}")]
    public ActionResult<IEnumerable<Product>> GetByCategory(string category)
    {
        var products = _products.Where(p => 
            p.Category.Equals(category, StringComparison.OrdinalIgnoreCase)).ToList();
        return Ok(products);
    }

    // GET: api/products/search?name=lap
    [HttpGet("search")]
    public ActionResult<IEnumerable<Product>> Search([FromQuery] string name)
    {
        var products = _products.Where(p => 
            p.Name.Contains(name, StringComparison.OrdinalIgnoreCase)).ToList();
        return Ok(products);
    }

    // POST: api/products
    [HttpPost]
    public ActionResult<Product> Create([FromBody] Product product)
    {
        product.Id = _products.Max(p => p.Id) + 1;
        _products.Add(product);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    // PUT: api/products/5
    [HttpPut("{id}")]
    public ActionResult<Product> Update(int id, [FromBody] Product product)
    {
        var existing = _products.FirstOrDefault(p => p.Id == id);
        if (existing == null)
            return NotFound(new { message = "Product not found" });

        existing.Name = product.Name;
        existing.Price = product.Price;
        existing.Category = product.Category;
        existing.Stock = product.Stock;

        return Ok(existing);
    }

    // PATCH: api/products/5/stock
    [HttpPatch("{id}/stock")]
    public ActionResult<Product> UpdateStock(int id, [FromBody] int stock)
    {
        var product = _products.FirstOrDefault(p => p.Id == id);
        if (product == null)
            return NotFound(new { message = "Product not found" });

        product.Stock = stock;
        return Ok(product);
    }

    // DELETE: api/products/5
    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
        var product = _products.FirstOrDefault(p => p.Id == id);
        if (product == null)
            return NotFound(new { message = "Product not found" });

        _products.Remove(product);
        return NoContent();
    }
}
