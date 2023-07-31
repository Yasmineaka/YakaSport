from flask import Flask, render_template, request, jsonify, session, redirect, flash, url_for
import re
import sqlite3

app = Flask(__name__)
app.secret_key = 'az'


DATABASE = "database.db"

# Fonction pour établir la connexion à la base de données
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# Fonction pour créer les tables des publications, des commentaires et des réponses aux commentaires
def create_tables():
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS publications
                          (id INTEGER PRIMARY KEY AUTOINCREMENT,
                           content TEXT NOT NULL,
                           image TEXT)''')
        cursor.execute('''CREATE TABLE IF NOT EXISTS comments
                          (id INTEGER PRIMARY KEY AUTOINCREMENT,
                           content TEXT NOT NULL,
                           publication_id INTEGER,
                           FOREIGN KEY(publication_id) REFERENCES publications(id))''')
        cursor.execute('''CREATE TABLE IF NOT EXISTS responses
                          (id INTEGER PRIMARY KEY AUTOINCREMENT,
                           content TEXT NOT NULL,
                           comment_id INTEGER,
                           FOREIGN KEY(comment_id) REFERENCES comments(id))''')

        cursor.execute('''CREATE TABLE IF NOT EXISTS users
                          (id INTEGER PRIMARY KEY AUTOINCREMENT,
                           name TEXT NOT NULL,
                           phone TEXT NOT NULL,
                           password TEXT NOT NULL)''')
        conn.commit()

# Créer les tables au démarrage de l'application
create_tables()
def backup_database():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()

    with open("backup.sql", "w") as f:
        for line in conn.iterdump():
            f.write("%s\n" % line)

    conn.close()


# Route pour afficher la page d'accueil
@app.route('/')
def page_accueil():
    return render_template('accueil0.html')
@app.route('/accueil1')
def accueil():
    return render_template('accueil.html')


@app.route('/publication')
def publier():
    return render_template('chat.html')

@app.route('/savoir_plus')
def savoir_plus():
    return render_template('savoir_plus.html')
@app.route('/a_propos')
def a_propos():
    return render_template('a_propos.html')
@app.route('/ticket')
def ticket():
    return render_template('ticket.html')

@app.route('/inscription', methods=['GET', 'POST'])
def inscription():
    if request.method == 'POST':
        name = request.form['name']
        phone = request.form['phone']
        password = request.form['password']

        # Vérifier si le nom contient uniquement des lettres ou des mots
        if not name.replace(" ", "").isalpha():
            flash("Le nom doit contenir uniquement des lettres ou des mots.")
            return render_template("inscription.html")

        # Vérifier si le téléphone contient uniquement des chiffres
        if not re.match(r'^[0-9+ ()-]*$', phone):
            flash("Le téléphone contient des caractères invalides.")
            return render_template("inscription.html")

        conn = get_db_connection()
        c = conn.cursor()

        # Vérifier si l'utilisateur existe déjà
        c.execute("SELECT * FROM users WHERE password=?", (password,))
        user = c.fetchone()

        if user:
            flash("Un utilisateur avec ce mot de passe existe déjà.")
            conn.close()
            return redirect(url_for('inscription'))

        # Insérer l'utilisateur dans la base de données
        c.execute("INSERT INTO users (name, phone, password) VALUES (?, ?, ?)", (name, phone, password))
        conn.commit()
        conn.close()

        flash("Inscription réussie. Vous pouvez maintenant vous connecter.", 'success')
        backup_database()  # Effectuer la sauvegarde de la base de données
        return redirect(url_for('connexion'))

    return render_template('inscription.html')


# Route pour la page de connexion
@app.route('/connexion', methods=['GET', 'POST'])
def connexion():
    # Dans la fonction connexion()
    if request.method == 'POST':
        password = request.form['password']
        phone = request.form['phone']

        conn = get_db_connection()
        c = conn.cursor()

        # Vérifier si le mot de passe et le numéro de téléphone correspondent à un utilisateur
        c.execute("SELECT * FROM users WHERE password=? AND phone=?", (password, phone))
        user = c.fetchone()

        if user:
            # Enregistrer l'utilisateur dans la session
            session['user_id'] = user['id']
            conn.close()
            return redirect(url_for('accueil'))
        else:
            flash("Mot de passe ou numéro de téléphone incorrect.")
            conn.close()
            return redirect(url_for('connexion'))
    return render_template("connexion.html")




# Route pour ajouter une nouvelle publication
@app.route('/add_post', methods=['POST'])
def add_post():
    content = request.form['content']
    image = request.form['image']
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('INSERT INTO publications (content, image) VALUES (?, ?)', (content, image))
        conn.commit()
    return jsonify({'message': 'Publication ajoutée avec succès!'})





if __name__ == '__main__':
    app.run(debug=True)
