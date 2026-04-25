#!/usr/bin/env python3
"""Génère les 3 documents KYC Retbaa Circle en PDF"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
import os

# Couleurs Retbaa
NAVY = HexColor('#1A3A6B')
ROSE = HexColor('#EFC0D4')
LIGHT_GREY = HexColor('#F5F5F5')
DARK_GREY = HexColor('#6B7280')
TEXT = HexColor('#1A1C1C')

OUT_DIR = "/home/work/.openclaw/workspace/retbaa-circle/public/docs/legal"
os.makedirs(OUT_DIR, exist_ok=True)

def base_styles():
    styles = getSampleStyleSheet()
    return {
        'header_label': ParagraphStyle('hl', fontName='Helvetica', fontSize=8,
            textColor=ROSE, spaceAfter=2, letterSpacing=3, alignment=TA_LEFT),
        'title': ParagraphStyle('t', fontName='Helvetica-BoldOblique', fontSize=22,
            textColor=NAVY, spaceAfter=6),
        'subtitle': ParagraphStyle('st', fontName='Helvetica', fontSize=10,
            textColor=DARK_GREY, spaceAfter=20),
        'section': ParagraphStyle('sec', fontName='Helvetica-Bold', fontSize=10,
            textColor=NAVY, spaceBefore=16, spaceAfter=6),
        'body': ParagraphStyle('b', fontName='Helvetica', fontSize=9,
            textColor=TEXT, spaceAfter=6, leading=14),
        'legal': ParagraphStyle('lg', fontName='Helvetica-Oblique', fontSize=7.5,
            textColor=DARK_GREY, spaceAfter=4, leading=11),
        'field_label': ParagraphStyle('fl', fontName='Helvetica-Bold', fontSize=8,
            textColor=NAVY, spaceAfter=2),
        'footer': ParagraphStyle('ft', fontName='Helvetica', fontSize=7,
            textColor=DARK_GREY, alignment=TA_CENTER),
    }

def header_block(story, s, doc_ref, doc_title):
    story.append(Paragraph("RETBAA CIRCLE — ESPACE INVESTISSEURS", s['header_label']))
    story.append(Paragraph(doc_title, s['title']))
    story.append(Paragraph(f"Référence document : {doc_ref} · Version 1.0 · Février 2026", s['subtitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=NAVY, spaceAfter=16))

def field_table(data, col_widths=None):
    """Tableau champ / valeur avec ligne de saisie"""
    table_data = []
    for label, hint in data:
        table_data.append([
            Paragraph(f"<b>{label}</b>", ParagraphStyle('fl', fontName='Helvetica-Bold',
                fontSize=8, textColor=NAVY)),
            Paragraph(f"<font color='#9CA3AF'>{hint}</font>",
                ParagraphStyle('fv', fontName='Helvetica', fontSize=9, textColor=TEXT)),
        ])
    t = Table(table_data, colWidths=col_widths or [5*cm, 11*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), LIGHT_GREY),
        ('BACKGROUND', (1,0), (1,-1), white),
        ('BOX', (0,0), (-1,-1), 0.5, HexColor('#E5E7EB')),
        ('INNERGRID', (0,0), (-1,-1), 0.3, HexColor('#E5E7EB')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    return t

def signature_block(story, s):
    story.append(Spacer(1, 0.8*cm))
    story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor('#E5E7EB'), spaceAfter=12))
    story.append(Paragraph("CERTIFICATION ET SIGNATURE", s['section']))
    story.append(Paragraph(
        "Je soussigné(e) certifie sur l'honneur l'exactitude des informations fournies dans ce document "
        "et m'engage à informer Retbaa de toute modification dans les meilleurs délais.",
        s['body']))
    story.append(Spacer(1, 0.5*cm))
    sig_data = [
        ["Fait à :", "__________________________", "Le :", "______________"],
        ["Nom et prénom :", "_________________________", "", ""],
        ["Signature :", "", "", ""],
        ["", "_________________________", "", ""],
    ]
    t = Table(sig_data, colWidths=[3*cm, 7*cm, 1.5*cm, 4.5*cm])
    t.setStyle(TableStyle([
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('TEXTCOLOR', (0,0), (0,-1), NAVY),
        ('TEXTCOLOR', (2,0), (2,-1), NAVY),
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('FONTNAME', (2,0), (2,-1), 'Helvetica-Bold'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t)
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph(
        "Document confidentiel — Retbaa SAS · 92 Avenue des Champs-Élysées, 75008 Paris · massata@retbaa.com",
        s['footer']))


# ─── DOCUMENT 1 : Déclaration d'origine des fonds ────────────────────────────

def gen_origine_fonds():
    path = f"{OUT_DIR}/kyc-declaration-origine-fonds.pdf"
    doc = SimpleDocTemplate(path, pagesize=A4,
        leftMargin=2.2*cm, rightMargin=2.2*cm,
        topMargin=2*cm, bottomMargin=2*cm)
    s = base_styles()
    story = []

    header_block(story, s, "RC-KYC-01", "Déclaration d'origine des fonds")

    story.append(Paragraph("OBJET", s['section']))
    story.append(Paragraph(
        "Conformément aux dispositions de la réglementation française sur la lutte contre le "
        "blanchiment de capitaux et le financement du terrorisme (LCB-FT — Articles L.561-1 et suivants "
        "du Code monétaire et financier), Retbaa SAS est tenue de vérifier l'origine des fonds investis "
        "par ses actionnaires.",
        s['body']))

    story.append(Paragraph("IDENTITÉ DE L'INVESTISSEUR", s['section']))
    story.append(field_table([
        ("Nom et prénom", "________________"),
        ("Date de naissance", "JJ/MM/AAAA"),
        ("Nationalité", "________________"),
        ("Adresse de résidence", "________________"),
        ("Référence investisseur", "RC-XXXX"),
        ("Montant de l'investissement", "________________ €"),
    ]))

    story.append(Paragraph("ORIGINE DES FONDS", s['section']))
    story.append(Paragraph(
        "Cochez la ou les sources de fonds correspondant à votre investissement :", s['body']))

    sources = [
        ("☐", "Revenus professionnels (salaires, honoraires, dividendes)"),
        ("☐", "Épargne personnelle constituée sur plusieurs années"),
        ("☐", "Produit de la vente d'un bien immobilier"),
        ("☐", "Héritage / Donation"),
        ("☐", "Produit de la cession d'une entreprise ou de parts sociales"),
        ("☐", "Revenus locatifs"),
        ("☐", "Autre (préciser ci-dessous)"),
    ]
    src_data = [[Paragraph(cb, ParagraphStyle('cb', fontName='Helvetica', fontSize=10)),
                 Paragraph(txt, ParagraphStyle('ct', fontName='Helvetica', fontSize=9, textColor=TEXT))]
                for cb, txt in sources]
    t = Table(src_data, colWidths=[0.8*cm, 15.2*cm])
    t.setStyle(TableStyle([
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t)
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph("Précisions complémentaires :", s['field_label']))
    story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor('#E5E7EB'), spaceAfter=6))
    story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor('#E5E7EB'), spaceAfter=6))
    story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor('#E5E7EB'), spaceAfter=6))

    story.append(Paragraph("JUSTIFICATIFS À JOINDRE", s['section']))
    story.append(Paragraph(
        "Selon la source déclarée, merci de joindre l'un des justificatifs suivants :", s['body']))
    story.append(Paragraph(
        "• Bulletins de salaire des 3 derniers mois · Avis d'imposition · Acte de vente immobilière · "
        "Acte notarié d'héritage/donation · Contrat de cession · Relevés bancaires (3 mois)",
        s['legal']))

    signature_block(story, s)
    doc.build(story)
    print(f"✅ {path}")

# ─── DOCUMENT 2 : Déclaration de statut PEP ──────────────────────────────────

def gen_pep():
    path = f"{OUT_DIR}/kyc-declaration-statut-pep.pdf"
    doc = SimpleDocTemplate(path, pagesize=A4,
        leftMargin=2.2*cm, rightMargin=2.2*cm,
        topMargin=2*cm, bottomMargin=2*cm)
    s = base_styles()
    story = []

    header_block(story, s, "RC-KYC-02", "Déclaration de statut — Personne Politiquement Exposée (PPE)")

    story.append(Paragraph("DÉFINITION RÉGLEMENTAIRE", s['section']))
    story.append(Paragraph(
        "Une Personne Politiquement Exposée (PPE) est une personne physique qui exerce ou a exercé "
        "d'importantes fonctions publiques, ainsi que ses proches (famille directe, associés étroits). "
        "Cette définition est issue de la Directive européenne 2015/849 (4ème directive LCB-FT) "
        "transposée en droit français à l'Article R.561-18 du Code monétaire et financier.",
        s['body']))

    story.append(Paragraph("EXEMPLES DE FONCTIONS CONCERNÉES", s['section']))
    story.append(Paragraph(
        "Chefs d'État ou de gouvernement · Ministres et secrétaires d'État · Parlementaires · "
        "Membres de cours suprêmes ou constitutionnelles · Dirigeants de banques centrales · "
        "Ambassadeurs et hauts-commissaires · Officiers supérieurs des forces armées · "
        "Membres d'organes d'administration d'entreprises publiques · "
        "Dirigeants d'organisations internationales.",
        s['legal']))

    story.append(Paragraph("IDENTITÉ DE L'INVESTISSEUR", s['section']))
    story.append(field_table([
        ("Nom et prénom", "________________"),
        ("Date de naissance", "JJ/MM/AAAA"),
        ("Nationalité", "________________"),
        ("Référence investisseur", "RC-XXXX"),
    ]))

    story.append(Paragraph("DÉCLARATION", s['section']))
    story.append(Paragraph(
        "Veuillez cocher la case correspondant à votre situation :", s['body']))

    dec_data = [
        ["☐", Paragraph("<b>Je déclare NE PAS être une PPE</b> — Je n'exerce pas et n'ai pas exercé "
            "de fonctions publiques importantes au cours des 12 derniers mois, et aucun membre "
            "de ma famille directe n'est PPE.",
            ParagraphStyle('d1', fontName='Helvetica', fontSize=9, textColor=TEXT, leading=14))],
        ["☐", Paragraph("<b>Je déclare ÊTRE une PPE</b> — Je suis ou j'ai été dans les 12 derniers mois "
            "une personne politiquement exposée, ou un membre de ma famille directe l'est.",
            ParagraphStyle('d2', fontName='Helvetica', fontSize=9, textColor=TEXT, leading=14))],
    ]
    t = Table(dec_data, colWidths=[0.8*cm, 15.2*cm])
    t.setStyle(TableStyle([
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOX', (0,0), (-1,-1), 0.5, HexColor('#E5E7EB')),
        ('INNERGRID', (0,0), (-1,-1), 0.3, HexColor('#E5E7EB')),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t)

    story.append(Paragraph("SI PPE — PRÉCISIONS", s['section']))
    story.append(Paragraph("Fonction exercée :", s['field_label']))
    story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor('#E5E7EB'), spaceAfter=10))
    story.append(Paragraph("Pays concerné :", s['field_label']))
    story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor('#E5E7EB'), spaceAfter=10))
    story.append(Paragraph("Période d'exercice :", s['field_label']))
    story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor('#E5E7EB'), spaceAfter=10))

    story.append(Paragraph(
        "Note : Le statut PPE n'est pas un obstacle à l'investissement. Il entraîne uniquement "
        "des mesures de vigilance renforcées conformément à la réglementation en vigueur.",
        s['legal']))

    signature_block(story, s)
    doc.build(story)
    print(f"✅ {path}")

# ─── DOCUMENT 3 : Attestation fiscale ────────────────────────────────────────

def gen_attestation_fiscale():
    path = f"{OUT_DIR}/kyc-attestation-fiscale.pdf"
    doc = SimpleDocTemplate(path, pagesize=A4,
        leftMargin=2.2*cm, rightMargin=2.2*cm,
        topMargin=2*cm, bottomMargin=2*cm)
    s = base_styles()
    story = []

    header_block(story, s, "RC-KYC-03", "Attestation fiscale et résidence fiscale")

    story.append(Paragraph("OBJET", s['section']))
    story.append(Paragraph(
        "Dans le cadre des obligations de conformité fiscale internationale (CRS/FATCA), "
        "Retbaa SAS est tenue de collecter les informations fiscales de ses actionnaires. "
        "Ce document est établi conformément à la norme OCDE d'échange automatique d'informations "
        "et à la loi française de mise en œuvre du Foreign Account Tax Compliance Act (FATCA).",
        s['body']))

    story.append(Paragraph("IDENTITÉ DE L'INVESTISSEUR", s['section']))
    story.append(field_table([
        ("Nom et prénom", "________________"),
        ("Date de naissance", "JJ/MM/AAAA"),
        ("Lieu de naissance", "________________"),
        ("Nationalité(s)", "________________"),
        ("Référence investisseur", "RC-XXXX"),
    ]))

    story.append(Paragraph("RÉSIDENCE FISCALE", s['section']))
    story.append(Paragraph(
        "Indiquez votre ou vos pays de résidence fiscale (pays où vous déclarez vos revenus) :", s['body']))
    story.append(field_table([
        ("Pays de résidence fiscale 1", "________________"),
        ("Numéro d'identification fiscale (NIF) 1", "________________"),
        ("Pays de résidence fiscale 2", "________________  (si applicable)"),
        ("Numéro d'identification fiscale (NIF) 2", "________________  (si applicable)"),
    ]))

    story.append(Paragraph("STATUT FATCA (CONTRIBUABLES AMÉRICAINS)", s['section']))
    story.append(Paragraph(
        "Êtes-vous un contribuable américain (US Person) au sens du droit fiscal américain ?", s['body']))
    fatca_data = [
        ["☐", "Non — Je ne suis pas citoyen américain, résident américain, ni détenteur d'une green card."],
        ["☐", "Oui — Je suis US Person. Mon numéro TIN (Tax Identification Number) : _______________"],
    ]
    t = Table([[Paragraph(a, ParagraphStyle('ca', fontName='Helvetica', fontSize=10)),
                Paragraph(b, ParagraphStyle('cb', fontName='Helvetica', fontSize=9, textColor=TEXT, leading=13))]
               for a, b in fatca_data], colWidths=[0.8*cm, 15.2*cm])
    t.setStyle(TableStyle([
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOX', (0,0), (-1,-1), 0.5, HexColor('#E5E7EB')),
        ('INNERGRID', (0,0), (-1,-1), 0.3, HexColor('#E5E7EB')),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t)

    story.append(Paragraph("ENGAGEMENT", s['section']))
    story.append(Paragraph(
        "Je m'engage à informer Retbaa SAS de tout changement de situation fiscale dans un délai "
        "de 30 jours. Je reconnais que Retbaa SAS est susceptible de transmettre ces informations "
        "aux autorités fiscales françaises conformément à ses obligations légales.",
        s['body']))

    story.append(Paragraph(
        "Base légale : Article 1649 AC du CGI · Décret n°2016-1683 du 5 décembre 2016 · "
        "Convention OCDE sur l'assistance administrative mutuelle en matière fiscale.",
        s['legal']))

    signature_block(story, s)
    doc.build(story)
    print(f"✅ {path}")

# ─── MAIN ─────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    gen_origine_fonds()
    gen_pep()
    gen_attestation_fiscale()
    print("\n✅ 3 documents KYC générés dans", OUT_DIR)
