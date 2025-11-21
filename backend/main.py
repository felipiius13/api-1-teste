# main.py
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from database import get_users_collection
from models import UserIn, UserLogin, PixInfo
import bcrypt
import os
from dotenv import load_dotenv
from typing import Dict

# --- Configuração ---
load_dotenv()
app = FastAPI()

# Permite que o Front-end (http://localhost:3000) se conecte ao Back-end
origins = [
    "http://localhost:3000",
    # Você adicionará aqui a URL do seu Front-end no Render depois
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chaves do .env
SECRET_KEY = os.getenv("SECRET_KEY")
PIX_KEY = os.getenv("PIX_KEY")
PIX_VALUE = os.getenv("PIX_VALUE")

# Função de hash de senha
def hash_password(password: str) -> str:
    # Gera um salt e hashea a senha
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Função para verificar a senha
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# SIMULAÇÃO DE JWT - Em um projeto real você usaria um módulo JWT
# Por simplicidade e foco, vamos apenas retornar o email como "token"
def create_token(data: Dict) -> str:
    return data["email"] # Simplesmente retorna o email

def decode_token(token: str) -> Dict:
    # Em um projeto real, faria a validação do token JWT aqui.
    # Aqui, apenas retornamos o email
    return {"email": token}

# Dependência para verificar se o usuário está logado
def get_current_user(auth_header: str = Depends(lambda header: header.get("Authorization"))):
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticação ausente ou inválido",
        )
    
    token = auth_header.split(" ")[1]
    
    try:
        payload = decode_token(token)
        user_email = payload.get("email")
        
        users = get_users_collection()
        user_db = users.find_one({"email": user_email})
        
        if user_db is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuário não encontrado",
            )
        
        return user_db
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
        )

# --- Rotas da API ---

@app.get("/")
def read_root():
    return {"message": "API está funcionando!"}

@app.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserIn):
    users = get_users_collection()
    
    # 1. Checa se o usuário já existe
    if users.find_one({"email": user.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="E-mail já cadastrado."
        )
    
    # 2. Hashea a senha
    hashed_password = hash_password(user.password)
    
    # 3. Prepara o documento para inserção
    user_data = user.dict()
    user_data["password"] = hashed_password
    
    # 4. Insere no MongoDB
    users.insert_one(user_data)
    
    return {"message": "Usuário registrado com sucesso. Por favor, faça login."}

@app.post("/login", status_code=status.HTTP_200_OK)
def login(user_login: UserLogin):
    users = get_users_collection()
    
    # 1. Encontra o usuário pelo e-mail
    user_db = users.find_one({"email": user_login.email})
    
    if user_db is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos."
        )
    
    # 2. Verifica a senha
    if not verify_password(user_login.password, user_db["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos."
        )
    
    # 3. Cria e retorna o token de autenticação
    token = create_token({"email": user_db["email"]})
    
    return {"token": token}

@app.get("/pix", response_model=PixInfo)
def get_pix_info(current_user: dict = Depends(get_current_user)):
    """Rota protegida que retorna as informações do PIX simulado."""
    
    # O código Copia e Cola é a chave + valor (simplificação)
    codigo_copia_cola = f"Simulado PIX: Chave {PIX_KEY} | Valor R${PIX_VALUE}"
    
    return PixInfo(
        chave_pix=PIX_KEY,
        valor=PIX_VALUE,
        codigo_copia_cola=codigo_copia_cola
    )