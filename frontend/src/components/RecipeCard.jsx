function RecipeCard({ title = 'Receta', description = 'Descripción breve de la receta', onClick = () => {} }) {
  return (
    <div className="card p-4 cursor-pointer hover:shadow-md transition" onClick={onClick}>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm muted">{description}</p>
    </div>
  );
}

export default RecipeCard;
