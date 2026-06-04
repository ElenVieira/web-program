package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	_ "github.com/mattn/go-sqlite3" // SQLite driver
)

// Entidade Aluno
type Aluno struct {
	RA    int    `json:"ra"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

// Repositório/Interface de Alunos
type AlunoRepository interface {
	Create(aluno Aluno) error
	GetAll() ([]Aluno, error)
	GetByRA(ra int) (Aluno, error)
	Update(aluno Aluno) error
	Delete(ra int) error
}

// Implementação do Repositório de Alunos
type SQLiteStorage struct {
	db *sql.DB
}

func (s *SQLiteStorage) Create(aluno Aluno) error {
	_, err := s.db.Exec("INSERT INTO alunos (ra, name, email) VALUES (?, ?, ?)", aluno.RA, aluno.Name, aluno.Email)
	return err
}

func (s *SQLiteStorage) GetAll() ([]Aluno, error) {
	linhas, err := s.db.Query("SELECT ra, name, email FROM alunos")
	if err != nil {
		return nil, err
	}
	defer linhas.Close()

	alunos := []Aluno{}
	for linhas.Next() {
		var aluno Aluno
		err = linhas.Scan(&aluno.RA, &aluno.Name, &aluno.Email)
		if err != nil {
			return nil, err
		}
		alunos = append(alunos, aluno)
	}
	return alunos, nil
}

func (s *SQLiteStorage) GetByRA(ra int) (Aluno, error) {
	var aluno Aluno
	err := s.db.QueryRow("SELECT ra, name, email FROM alunos WHERE ra = ?", ra).
		Scan(&aluno.RA, &aluno.Name, &aluno.Email)
	if err == sql.ErrNoRows {
		return aluno, fmt.Errorf("aluno com RA %d não encontrado", ra)
	}
	return aluno, err
}

func (s *SQLiteStorage) Update(aluno Aluno) error {
	resultado, err := s.db.Exec("UPDATE alunos SET name = ?, email = ? WHERE ra = ?", aluno.Name, aluno.Email, aluno.RA)
	if err != nil {
		return err
	}
	linhasAfetadas, _ := resultado.RowsAffected()
	if linhasAfetadas == 0 {
		return fmt.Errorf("aluno com RA %d não encontrado", aluno.RA)
	}
	return nil
}

func (s *SQLiteStorage) Delete(ra int) error {
	resultado, err := s.db.Exec("DELETE FROM alunos WHERE ra = ?", ra)
	if err != nil {
		return err
	}
	linhasAfetadas, _ := resultado.RowsAffected()
	if linhasAfetadas == 0 {
		return fmt.Errorf("aluno com RA %d não encontrado", ra)
	}
	return nil
}

// Controladores de Alunos

func listarAlunos(repo AlunoRepository) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		alunos, err := repo.GetAll()
		if err != nil {
			http.Error(w, "Erro ao listar alunos", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(alunos)
	}
}

func buscarAluno(repo AlunoRepository) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		raStr := r.PathValue("ra")
		ra, err := strconv.Atoi(raStr)
		if err != nil {
			http.Error(w, "RA inválido", http.StatusBadRequest)
			return
		}
		aluno, err := repo.GetByRA(ra)
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(aluno)
	}
}

func criarAluno(repo AlunoRepository) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var aluno Aluno
		err := json.NewDecoder(r.Body).Decode(&aluno)
		if err != nil {
			http.Error(w, "Erro ao decodificar o corpo da requisição", http.StatusBadRequest)
			return
		}
		err = repo.Create(aluno)
		if err != nil {
			http.Error(w, "Erro ao criar aluno: "+err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(aluno)
	}
}

func atualizarAluno(repo AlunoRepository) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		raStr := r.PathValue("ra")
		ra, err := strconv.Atoi(raStr)
		if err != nil {
			http.Error(w, "RA inválido", http.StatusBadRequest)
			return
		}
		var aluno Aluno
		err = json.NewDecoder(r.Body).Decode(&aluno)
		if err != nil {
			http.Error(w, "Erro ao decodificar o corpo da requisição", http.StatusBadRequest)
			return
		}
		aluno.RA = ra
		err = repo.Update(aluno)
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(aluno)
	}
}

func deletarAluno(repo AlunoRepository) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		raStr := r.PathValue("ra")
		ra, err := strconv.Atoi(raStr)
		if err != nil {
			http.Error(w, "RA inválido", http.StatusBadRequest)
			return
		}
		err = repo.Delete(ra)
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

func inicializarBancoDeDados(caminho string) *sql.DB {
	db, err := sql.Open("sqlite3", caminho)
	if err != nil {
		log.Fatalf("Erro ao abrir o banco de dados: %v", err)
	}
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS alunos (ra INTEGER PRIMARY KEY, name TEXT, email TEXT)")
	if err != nil {
		log.Fatalf("Erro ao criar a tabela alunos: %v", err)
	}
	return db
}

func main() {
	conexao := inicializarBancoDeDados("./data/fatec.db")
	defer conexao.Close()
	repo := &SQLiteStorage{db: conexao}

	http.HandleFunc("GET /alunos", listarAlunos(repo))
	http.HandleFunc("GET /alunos/{ra}", buscarAluno(repo))
	http.HandleFunc("POST /alunos", criarAluno(repo))
	http.HandleFunc("PUT /alunos/{ra}", atualizarAluno(repo))
	http.HandleFunc("DELETE /alunos/{ra}", deletarAluno(repo))

	fmt.Println("Servidor rodando na porta 8080")
	fmt.Println("Rotas disponíveis:")
	fmt.Println("  GET    http://localhost:8080/alunos")
	fmt.Println("  GET    http://localhost:8080/alunos/{ra}")
	fmt.Println("  POST   http://localhost:8080/alunos")
	fmt.Println("  PUT    http://localhost:8080/alunos/{ra}")
	fmt.Println("  DELETE http://localhost:8080/alunos/{ra}")
	http.ListenAndServe(":8080", nil)
}
