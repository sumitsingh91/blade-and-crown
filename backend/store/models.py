# backend/store/models.py
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    order = models.IntegerField(default=0)

    class Meta:
        verbose_name_plural = 'categories'
        ordering = ['order']

    def __str__(self):
        return self.name


class Product(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products'
    )
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    brand = models.CharField(
        max_length=100,
        default="BLADE & CROWN"
    )
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    old_price = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        blank=True,
        null=True
    )
    image = models.ImageField(upload_to='products/')
    additional_images = models.JSONField(
        default=list,
        blank=True
    )
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0
    )
    review_count = models.IntegerField(default=0)
    stock = models.IntegerField(default=0)
    badge = models.CharField(
        max_length=20,
        blank=True,
        choices=[
            ('bestseller', 'BESTSELLER'),
            ('new', 'NEW'),
            ('sale', 'SALE'),
        ]
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def is_on_sale(self):
        return self.old_price is not None and self.old_price > self.price

    @property
    def in_stock(self):
        return self.stock > 0


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    shipping_address = models.TextField()
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    stripe_payment_id = models.CharField(
        max_length=200,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.id} - {self.customer_name}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
