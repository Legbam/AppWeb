powershell
param(
    [string]message = "Mise à jour"
)

git add .
git commit -m $message
git push origin main