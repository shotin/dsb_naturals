import { useEffect, useState } from "react";
import { HTTP } from "../../utils";
import { toast } from "sonner";

const emptySlide = { eyebrow: "", title: "", accent_title: "", subtitle: "", image_url: "", cta_label: "Shop now", cta_url: "/shop", sort_order: 0, is_active: true };

export default function HomepageSlides() {
  const [slides, setSlides] = useState([]);
  const [slide, setSlide] = useState(emptySlide);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");
  const auth = { headers: { Authorization: `Bearer ${token}` } };

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const { data } = await HTTP.get("/admin/home-slides", auth);
      setSlides(data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load homepage slides");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchSlides(); }, []);

  const edit = (item) => {
    setEditingId(item.id);
    setSlide({ ...emptySlide, ...item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingId) await HTTP.put(`/admin/home-slides/${editingId}`, slide, auth);
      else await HTTP.post("/admin/home-slides", slide, auth);
      toast.success(editingId ? "Slide updated" : "Slide added");
      setEditingId(null);
      setSlide(emptySlide);
      await fetchSlides();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save slide");
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this homepage slide?")) return;
    try {
      await HTTP.delete(`/admin/home-slides/${id}`, auth);
      toast.success("Slide deleted");
      await fetchSlides();
    } catch (error) { toast.error(error.response?.data?.message || "Could not delete slide"); }
  };

  const field = (name, label, type = "text") => <div className="mb-3" key={name}>
    <label className="form-label" htmlFor={`slide-${name}`}>{label}</label>
    {name === "subtitle" ? <textarea id={`slide-${name}`} className="form-control" rows="3" value={slide[name] || ""} onChange={(e) => setSlide({ ...slide, [name]: e.target.value })} /> : <input id={`slide-${name}`} className="form-control" type={type} value={slide[name] ?? ""} onChange={(e) => setSlide({ ...slide, [name]: type === "number" ? Number(e.target.value) : e.target.value })} required={["title", "image_url", "cta_label", "cta_url"].includes(name)} />}
  </div>;

  return <div className="container-fluid py-2">
    <div className="admin-page-heading"><div><h2>Homepage hero slides</h2><p>Edit the carousel content shown on your storefront homepage.</p></div></div>
    <form className="card card-body mb-4" onSubmit={save}>
      <h5>{editingId ? "Edit slide" : "Add a slide"}</h5>
      <div className="row"><div className="col-md-6">{field("eyebrow", "Small heading")}{field("title", "Main heading")}{field("accent_title", "Highlighted heading")}{field("subtitle", "Description")}</div><div className="col-md-6">{field("image_url", "Image URL", "url")}{field("cta_label", "Button label")}{field("cta_url", "Button link")}{field("sort_order", "Display order", "number")}
        <div className="form-check mb-3"><input id="slide-active" className="form-check-input" type="checkbox" checked={Boolean(slide.is_active)} onChange={(e) => setSlide({ ...slide, is_active: e.target.checked })} /><label className="form-check-label" htmlFor="slide-active">Visible on homepage</label></div>
        {slide.image_url && <img src={slide.image_url} alt="Slide preview" style={{ width: "100%", maxHeight: 170, objectFit: "cover" }} />}</div></div>
      <div className="d-flex gap-2"><button className="btn btn-dark" type="submit" disabled={saving}>{saving ? "Saving…" : editingId ? "Update slide" : "Add slide"}</button>{editingId && <button className="btn btn-outline-secondary" type="button" onClick={() => { setEditingId(null); setSlide(emptySlide); }}>Cancel edit</button>}</div>
    </form>
    {loading ? <p>Loading slides…</p> : <div className="row g-3">{slides.map((item) => <div className="col-md-6 col-xl-4" key={item.id}><article className="card h-100"><img src={item.image_url} alt="" className="card-img-top" style={{ height: 210, objectFit: "cover" }} /><div className="card-body"><small className="text-uppercase text-muted">{item.eyebrow} · order {item.sort_order} · {item.is_active ? "Visible" : "Hidden"}</small><h5 className="mt-2">{item.title} {item.accent_title}</h5><p className="text-muted">{item.subtitle}</p><div className="d-flex gap-2"><button className="btn btn-sm btn-outline-dark" onClick={() => edit(item)}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={() => remove(item.id)}>Delete</button></div></div></article></div>)}</div>}
  </div>;
}
