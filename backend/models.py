# models.py
from pydantic import BaseModel, Field, EmailStr
from typing import Optional

# Modelo para o registro de usuário
class UserIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)

# Modelo para o retorno do usuário (sem a senha)
class UserOut(BaseModel):
    id: Optional[str] = Field(alias="_id")
    email: EmailStr
    
# Modelo para o login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Modelo para a resposta PIX
class PixInfo(BaseModel):
    chave_pix: str
    valor: str
    codigo_copia_cola: str # Código simulado de pagamento (o que o usuário copia)