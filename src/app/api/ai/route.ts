import { NextResponse } from 'next/server';
import { AiEngine } from '@/lib/ai-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, prompt, groomName, brideName, theme, schema } = body;

    if (action === 'get-presets') {
      const presets = AiEngine.getPresets();
      return NextResponse.json({ presets });
    }

    if (action === 'generate-design') {
      const generatedSchema = AiEngine.generateDesignSchema({ prompt: prompt || '' });
      return NextResponse.json({ schema: generatedSchema });
    }

    if (action === 'generate-copy') {
      const copy = AiEngine.generateCopywriting({
        groomName: groomName || 'Pengantin Pria',
        brideName: brideName || 'Pengantin Wanita',
        theme: theme || 'Islami',
      });
      return NextResponse.json({ copy });
    }

    if (action === 'auto-improve' && schema) {
      const improved = AiEngine.autoImproveDesign(schema);
      const score = AiEngine.evaluateDesignScore(improved);
      return NextResponse.json({ schema: improved, score });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('AI Processing Error:', error);
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
  }
}
